import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { toUserListItemDTO, userListSelect } from "@/server/mappers";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

const ROLES = ["client", "manager", "admin"] as const;
const STATUSES = ["active", "blocked", "deleted"] as const;

// GET /api/admin/users - список пользователей (?role=, ?status=, ?q=)
export const GET = handle(async (req) => {
  await requireAdmin(req);

  const { searchParams } = req.nextUrl;
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.usersWhereInput = {};
  if (role && role !== "all") {
    if (!ROLES.includes(role as (typeof ROLES)[number])) throw badRequest("Некорректная роль");
    where.role = role as (typeof ROLES)[number];
  }
  if (status && status !== "all") {
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw badRequest("Некорректный статус");
    where.status = status as (typeof STATUSES)[number];
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  const users = await prisma.users.findMany({ where, select: userListSelect, orderBy: { created_at: "desc" } });
  const items = users.map(toUserListItemDTO);
  return NextResponse.json({ users: items, total: items.length });
});

const createSchema = z
  .object({
    name: z.string({ required_error: "Укажите имя" }).trim().min(1, "Укажите имя").max(100),
    email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    role: z.enum(ROLES).default("client"),
    password: z.string().min(8, "Пароль должен быть не короче 8 символов").optional().or(z.literal("")),
  })
  .refine((d) => d.email || d.phone, { message: "Укажите email или телефон" });

// POST /api/admin/users - создать пользователя или сотрудника
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, createSchema);

  const email = input.email || null;
  const phone = input.phone || null;

  if (email && (await prisma.users.findUnique({ where: { email }, select: { id: true } }))) {
    throw conflict("User with this email already exists");
  }
  if (phone && (await prisma.users.findUnique({ where: { phone }, select: { id: true } }))) {
    throw conflict("User with this phone already exists");
  }

  const now = new Date();
  const user = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      name: input.name,
      email,
      phone,
      role: input.role,
      status: "active",
      avatar: "default",
      password: input.password ? await bcrypt.hash(input.password, 10) : null,
      created_at: now,
      updated_at: now,
    },
    select: userListSelect,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "CREATE_USER",
    entityType: "User",
    entityId: user.id,
    newData: { name: user.name, email: user.email, phone: user.phone, role: user.role },
  });

  return NextResponse.json(
    { success: true, user: toUserListItemDTO(user), message: "User created successfully" },
    { status: 201 }
  );
});
