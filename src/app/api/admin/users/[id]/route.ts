import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, handle, notFound } from "@/server/http";
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
