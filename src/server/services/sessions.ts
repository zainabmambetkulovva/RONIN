/**
 * Игровые сессии: фактическое время игры клиента за компьютером.
 * Сессия всегда связана с оплаченной подтверждённой бронью; запускает и завершает её сотрудник.
 */
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { conflict, notFound } from "@/server/http";
import type { GamingSessionDTO } from "@/types/api";

/** За сколько минут до начала брони можно посадить клиента. */
export const SESSION_EARLY_START_MINUTES = 15;

export const sessionInclude = {
  computers: { select: { id: true, number: true, computer_categories: { select: { name: true } } } },
  bookings: {
    select: {
      id: true,
      booking_code: true,
      start_at: true,
      end_at: true,
      tariffs: { select: { name: true } },
      users: { select: { id: true, name: true, phone: true } },
    },
  },
  users: { select: { id: true, name: true } },
} satisfies Prisma.gaming_sessionsInclude;

export function toSessionDTO(s: Prisma.gaming_sessionsGetPayload<{ include: typeof sessionInclude }>): GamingSessionDTO {
  const end = s.ended_at ?? new Date();
  return {
    id: s.id,
    status: s.status,
    startedAt: s.started_at.toISOString(),
    endedAt: s.ended_at ? s.ended_at.toISOString() : null,
    durationMinutes: Math.max(0, Math.round((end.getTime() - s.started_at.getTime()) / 60_000)),
    computer: { id: s.computers.id, number: s.computers.number, category: s.computers.computer_categories.name },
    booking: {
      id: s.bookings.id,
      bookingCode: s.bookings.booking_code,
      startAt: s.bookings.start_at.toISOString(),
      endAt: s.bookings.end_at.toISOString(),
      tariffName: s.bookings.tariffs.name,
    },
    client: { id: s.bookings.users.id, name: s.bookings.users.name, phone: s.bookings.users.phone },
    startedBy: { id: s.users.id, name: s.users.name },
  };
}

export async function startSession(bookingId: string, staffId: string) {
  return prisma.$transaction(
    async (tx) => {
      const booking = await tx.bookings.findUnique({
        where: { id: bookingId },
        include: { computers: true, gaming_sessions: { where: { status: "active" }, select: { id: true } } },
      });
      if (!booking) throw notFound("Бронирование не найдено");
      if (booking.status !== "confirmed" || booking.payment_status !== "paid") {
        throw conflict("Сессию можно начать только по оплаченной подтверждённой брони", "not_paid");
      }
      if (booking.gaming_sessions.length > 0) throw conflict("Сессия по этой брони уже идёт", "session_exists");

      const now = new Date();
      if (now.getTime() < booking.start_at.getTime() - SESSION_EARLY_START_MINUTES * 60_000) {
        throw conflict(`Сессию можно начать не раньше чем за ${SESSION_EARLY_START_MINUTES} минут до брони`, "too_early");
      }
      if (now >= booking.end_at) throw conflict("Время брони уже закончилось", "booking_over");
      if (booking.computers.status === "maintenance") throw conflict("Компьютер на обслуживании", "computer_maintenance");

      const busy = await tx.gaming_sessions.findFirst({
        where: { computer_id: booking.computer_id, status: "active" },
        select: { id: true },
      });
      if (busy) throw conflict("На этом компьютере уже идёт другая сессия", "computer_in_use");

      return tx.gaming_sessions.create({
        data: {
          id: crypto.randomUUID(),
          booking_id: booking.id,
          computer_id: booking.computer_id,
          started_by: staffId,
          started_at: now,
          status: "active",
          created_at: now,
        },
        include: sessionInclude,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

/** Завершение сессии (клиент ушёл или время вышло). Бронь отмечается завершённой. */
export async function endSession(sessionId: string, staffId: string) {
  const session = await prisma.gaming_sessions.findUnique({ where: { id: sessionId }, include: { bookings: true } });
  if (!session) throw notFound("Сессия не найдена");
  if (session.status !== "active") throw conflict("Сессия уже завершена", "session_closed");

  const now = new Date();
  const [updated] = await prisma.$transaction([
    prisma.gaming_sessions.update({ where: { id: sessionId }, data: { status: "completed", ended_at: now }, include: sessionInclude }),
    prisma.bookings.update({ where: { id: session.booking_id }, data: { status: "completed", updated_at: now } }),
    prisma.booking_status_history.create({
      data: {
        id: crypto.randomUUID(),
        booking_id: session.booking_id,
        old_status: session.bookings.status,
        new_status: "completed",
        changed_by: staffId,
        reason: "Игровая сессия завершена",
        created_at: now,
      },
    }),
  ]);
  return updated;
}

/** Для cron: сессии, у которых закончилось время брони, отмечаются истёкшими. */
export async function expireFinishedSessions() {
  const now = new Date();
  const finished = await prisma.gaming_sessions.findMany({
    where: { status: "active", bookings: { end_at: { lte: now } } },
    select: { id: true, bookings: { select: { end_at: true } } },
  });
  for (const s of finished) {
    await prisma.gaming_sessions.update({ where: { id: s.id }, data: { status: "expired", ended_at: s.bookings.end_at } });
  }
  return finished.length;
}
