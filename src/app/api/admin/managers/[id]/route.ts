import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, handle, notFound, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { toUserListItemDTO, userListSelect } from "@/server/mappers";
import { writeAuditLog } from "@/server/services/audit";

async function findManager(id: string) {
  const manager = await prisma.users.findFirst({ where: { id, role: "manager" }, select: userListSelect });
  if (!manager) throw notFound("Manager not found");
  return manager;
}

// GET /api/admin/managers/[id]
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireAdmin(req);
  return NextResponse.json({ manager: toUserListItemDTO(await findManager(params.id)) });
});

// DELETE /api/admin/managers/[id] - мягкое удаление: история действий менеджера сохраняется
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const manager = await findManager(params.id);

  await prisma.users.update({ where: { id: params.id }, data: { status: "deleted", updated_at: new Date() } });

  await writeAuditLog({
    userId: admin.id,
    action: "DELETE_MANAGER",
    entityType: "User",
    entityId: params.id,
    oldData: { name: manager.name, email: manager.email, status: manager.status },
  });

  return NextResponse.json({ success: true });
});

const updateSchema = z.object({
  status: z.enum(["active", "blocked"]).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().min(1).max(20).optional(),
  email: z.string().trim().email("Некорректный email").optional(),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов").optional(),
  telegramChatId: z.string().trim().regex(/^-?\d{4,20}$/, "Telegram chat ID — только цифры").optional().or(z.literal("")),
});

// PATCH /api/admin/managers/[id] - обновить данные, статус или пароль
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, updateSchema);
  const before = await findManager(params.id);

  if (Object.values(input).every((v) => v === undefined)) throw badRequest("Нет данных для обновления");

  const manager = await prisma.users.update({
    where: { id: params.id },
    data: {
      ...(input.status && { status: input.status }),
      ...(input.name && { name: input.name }),
      ...(input.phone && { phone: input.phone }),
      ...(input.email && { email: input.email }),
      ...(input.password && { password: await bcrypt.hash(input.password, 10) }),
      ...(input.telegramChatId !== undefined && { telegram_chat_id: input.telegramChatId || null }),
      updated_at: new Date(),
    },
    select: userListSelect,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_MANAGER",
    entityType: "User",
    entityId: params.id,
    oldData: { name: before.name, email: before.email, phone: before.phone, status: before.status },
    newData: {
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      status: manager.status,
      passwordChanged: Boolean(input.password),
    },
  });

  return NextResponse.json({ manager: toUserListItemDTO(manager) });
});
