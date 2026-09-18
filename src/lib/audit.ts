import { prisma } from "./prisma";

export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  oldData,
  newData,
}: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: object;
  newData?: object;
}) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      oldData: oldData ? (oldData as any) : undefined,
      newData: newData ? (newData as any) : undefined,
    },
  });
}
