import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { conflict, handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { toUserListItemDTO, userListSelect } from "@/server/mappers";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/managers - список менеджеров
export const GET = handle(async (req) => {
  await requireAdmin(req);

  const managers = await prisma.users.findMany({
    where: { role: "manager" },
    select: userListSelect,
    orderBy: { created_at: "desc" },
  });

  const items = managers.map(toUserListItemDTO);
  return NextResponse.json({ managers: items, total: items.length });
});

const createSchema = z.object({
  name: z.string({ required_error: "Name and phone are required" }).trim().min(1).max(100),
  phone: z.string({ required_error: "Name and phone are required" }).trim().min(1).max(20),
  email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
  password: z.string({ required_error: "Пароль обязателен" }).min(8, "Пароль должен быть не короче 8 символов"),
});

// POST /api/admin/managers - создать менеджера
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, createSchema);
  const email = input.email || null;

  const existing = await prisma.users.findFirst({
    where: { OR: [{ phone: input.phone }, ...(email ? [{ email }] : [])] },
    select: { id: true },
  });
  if (existing) throw conflict("User with this phone or email already exists");

  const now = new Date();
  const manager = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone,
      email,
      password: await bcrypt.hash(input.password, 10),
      role: "manager",
      status: "active",
      avatar: "default",
      created_at: now,
      updated_at: now,
    },
    select: userListSelect,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "CREATE_MANAGER",
    entityType: "User",
    entityId: manager.id,
    newData: { name: manager.name, email: manager.email, phone: manager.phone },
  });

  return NextResponse.json({ manager: toUserListItemDTO(manager) }, { status: 201 });
});
