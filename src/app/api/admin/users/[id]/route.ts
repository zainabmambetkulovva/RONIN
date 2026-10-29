import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, handle, notFound, parseJson } from "@/server/http";
import { toUserListItemDTO, userListSelect } from "@/server/mappers";
import { requireAdmin } from "@/server/auth/staff";
import { writeAuditLog } from "@/server/services/audit";

// DELETE /api/admin/users/[id] - мягкое удаление (status = deleted), история броней сохраняется
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  if (params.id === admin.id) throw badRequest("Cannot delete your own account");

  const user = await prisma.users.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  if (!user) throw notFound("User not found");

  await prisma.users.update({
    where: { id: params.id },
    data: { status: "deleted", updated_at: new Date() },
  });

  await writeAuditLog({
    userId: admin.id,
    action: "DELETE_USER",
    entityType: "User",
    entityId: params.id,
    oldData: { name: user.name, email: user.email, role: user.role, status: user.status },
  });

  return NextResponse.json({ success: true, message: "User deleted successfully" });
});

const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  role: z.enum(["client", "manager", "admin"]).optional(),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов").optional(),
  telegramChatId: z.string().trim().regex(/^-?\d{4,20}$/, "Telegram ID — только цифры").optional().or(z.literal("")),
});

// PATCH /api/admin/users/[id] - роль, имя, пароль, Telegram ID (код входа в панель для сотрудников)
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, updateSchema);
  if (Object.values(input).every((v) => v === undefined)) throw badRequest("Нет данных для обновления");
  if (params.id === admin.id && input.role && input.role !== "admin") throw badRequest("Нельзя снять роль администратора с себя");

  const before = await prisma.users.findUnique({ where: { id: params.id }, select: { ...userListSelect, telegram_chat_id: true } });
  if (!before || before.status === "deleted") throw notFound("User not found");

  const user = await prisma.users.update({
    where: { id: params.id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.role && { role: input.role }),
      ...(input.password && { password: await bcrypt.hash(input.password, 10) }),
      ...(input.telegramChatId !== undefined && { telegram_chat_id: input.telegramChatId || null }),
      updated_at: new Date(),
    },
    select: userListSelect,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_USER",
    entityType: "User",
    entityId: params.id,
    oldData: { name: before.name, role: before.role, telegramLinked: Boolean(before.telegram_chat_id) },
    newData: { name: user.name, role: user.role, passwordChanged: Boolean(input.password), telegramChanged: input.telegramChatId !== undefined },
  });

  return NextResponse.json({ user: toUserListItemDTO(user) });
});
