/**
 * Доступность компьютеров во времени.
 *
 * Компьютер занят в интервале [start, end), если с ним пересекается «активная» бронь:
 *  - подтверждённая (confirmed);
 *  - оплаченная по данным платёжной системы (payment_status = paid), даже если статус ещё не обновлён;
 *  - неоплаченная (pending), созданная не более BOOKING_HOLD_MINUTES назад.
 * Компьютеры на обслуживании недоступны всегда.
 *
 * Эту же логику используют: создание брони, список компьютеров, AI-чат и будущая 3D-карта.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BOOKING_HOLD_MINUTES } from "@/server/config";

type Db = PrismaClient | Prisma.TransactionClient;

export function holdCutoff(now = new Date()) {
  return new Date(now.getTime() - BOOKING_HOLD_MINUTES * 60_000);
}

/** Условие «бронь блокирует компьютер». */
export function blockingBookingWhere(now = new Date()): Prisma.bookingsWhereInput {
  return {
    OR: [
      { status: "confirmed" },
      { payment_status: "paid", status: { notIn: ["cancelled", "expired"] } },
      { status: "pending", created_at: { gt: holdCutoff(now) } },
    ],
  };
}

/** Пересечение интервалов: existing.start < end && existing.end > start. */
export function overlapsWhere(start: Date, end: Date): Prisma.bookingsWhereInput {
  return { start_at: { lt: end }, end_at: { gt: start } };
}

export async function findBusyComputerIds(start: Date, end: Date, db: Db = prisma): Promise<Set<string>> {
  const rows = await db.bookings.findMany({
    where: { AND: [overlapsWhere(start, end), blockingBookingWhere()] },
    select: { computer_id: true },
    distinct: ["computer_id"],
  });
  return new Set(rows.map((r) => r.computer_id));
}

export async function isComputerFree(
  computerId: string,
  start: Date,
  end: Date,
  db: Db = prisma,
  excludeBookingId?: string
): Promise<boolean> {
  const clash = await db.bookings.findFirst({
    where: {
      computer_id: computerId,
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      AND: [overlapsWhere(start, end), blockingBookingWhere()],
    },
    select: { id: true },
  });
  return !clash;
}

/** Компьютеры, занятые прямо сейчас (активная подтверждённая бронь). */
export async function findOccupiedNowComputerIds(db: Db = prisma): Promise<Set<string>> {
  const now = new Date();
  return findBusyComputerIds(now, new Date(now.getTime() + 1000), db);
}
