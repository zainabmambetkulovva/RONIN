import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { conflict, handle, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { writeAuditLog } from "@/server/services/audit";
import type { ClientDTO } from "@/types/api";

export const dynamic = "force-dynamic";

// GET /api/admin/clients?q= — клиенты клуба (admin, manager). Пароли и служебные данные не отдаются.
export const GET = handle(async (req) => {
  await requireStaff(req);
  const q = req.nextUrl.searchParams.get("q")?.trim();

  const where: Prisma.usersWhereInput = { role: "client", status: { not: "deleted" } };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q.replace(/\s/g, "") } },
    ];
  }

  const clients = await prisma.users.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      created_at: true,
      _count: { select: { bookings: true } },
      bookings: { select: { start_at: true }, orderBy: { start_at: "desc" }, take: 1 },
    },
    orderBy: { created_at: "desc" },
    take: q ? 50 : 200,
  });

  const items: ClientDTO[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    createdAt: c.created_at.toISOString(),
    bookingsCount: c._count.bookings,
    lastBookingAt: c.bookings[0]?.start_at.toISOString() ?? null,
  }));
  return NextResponse.json({ clients: items, total: items.length });
});

const createSchema = z.object({
  name: z.string({ required_error: "Укажите имя" }).trim().min(1, "Укажите имя").max(100),
  phone: z
    .string({ required_error: "Укажите телефон" })
    .trim()
    .min(5, "Укажите телефон")
    .max(20)
    .regex(/^\+?[0-9\s()-]+$/, "Некорректный номер телефона"),
  email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
});

/**
 * POST /api/admin/clients — карточка клиента для брони в клубе (admin, manager).
 * Создаётся только роль client и без пароля; войти на сайт клиент сможет после восстановления доступа.
 */
export const POST = handle(async (req) => {
  const staff = await requireStaff(req);
  const input = await parseJson(req, createSchema);
  const phone = input.phone.replace(/[\s()-]/g, "");
  const email = input.email || null;

  const existing = await prisma.users.findFirst({
    where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    select: { id: true },
  });
  if (existing) throw conflict("Клиент с таким телефоном или email уже есть — найдите его в поиске", "client_exists");

  const now = new Date();
  const client = await prisma.users.create({
    data: { id: crypto.randomUUID(), name: input.name, phone, email, role: "client", status: "active", avatar: "default", created_at: now, updated_at: now },
    select: { id: true, name: true, phone: true, email: true },
  });

  await writeAuditLog({ userId: staff.id, action: "CREATE_CLIENT", entityType: "User", entityId: client.id, newData: client });
  return NextResponse.json({ client }, { status: 201 });
});
