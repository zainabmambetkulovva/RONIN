import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, handle, notFound, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { toUserListItemDTO, userListSelect } from "@/server/mappers";
import { notifyUser, writeAuditLog } from "@/server/services/audit";

const schema = z.object({ status: z.enum(["active", "blocked"], { message: "Invalid status" }) });

// PATCH /api/admin/users/[id]/status - заблокировать / разблокировать пользователя
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const { status } = await parseJson(req, schema);
  if (params.id === admin.id) throw badRequest("Нельзя изменить статус своего аккаунта");

  const user = await prisma.users.findUnique({ where: { id: params.id }, select: { id: true, status: true } });
  if (!user) throw notFound("User not found");

  const updated = await prisma.users.update({
    where: { id: params.id },
    data: { status, updated_at: new Date() },
    select: userListSelect,
  });

  await writeAuditLog({
    userId: admin.id,
    action: status === "blocked" ? "BLOCK_USER" : "UNBLOCK_USER",
    entityType: "User",
    entityId: params.id,
    oldData: { status: user.status },
    newData: { status },
  });

  await notifyUser(
    params.id,
    status === "blocked" ? "account_blocked" : "account_activated",
    status === "blocked" ? "Аккаунт заблокирован" : "Аккаунт активирован",
    status === "blocked" ? "Ваш аккаунт был заблокирован администратором." : "Ваш аккаунт был активирован."
  );

  return NextResponse.json({
    success: true,
    user: toUserListItemDTO(updated),
    message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
  });
});
