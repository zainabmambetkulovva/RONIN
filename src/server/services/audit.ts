import crypto from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Запись в журнал действий. Ошибка записи журнала не прерывает основное действие.
 * `userId` — реальный пользователь, выполнивший действие (FK на users).
 */
export async function writeAuditLog(entry: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: object;
  newData?: object;
}) {
  try {
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        user_id: entry.userId,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId ?? null,
        old_data: entry.oldData as Prisma.InputJsonValue | undefined,
        new_data: entry.newData as Prisma.InputJsonValue | undefined,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.warn("[audit] Failed to write audit log:", entry.action, error);
  }
}

export async function notifyUser(userId: string, type: string, title: string, message: string) {
  try {
    await prisma.notifications.create({
      data: { id: crypto.randomUUID(), user_id: userId, type, title, message, is_read: false, created_at: new Date() },
    });
  } catch (error) {
    console.warn("[notifications] Failed to create notification:", type, error);
  }
}
