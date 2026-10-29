/**
 * Бронирования: создание, отмена, истечение.
 *
 * Правила:
 *  - новая бронь всегда создаётся со статусом pending и фиксированной ценой тарифа на момент создания;
 *  - подтверждение (confirmed) выставляется только по подтверждённой оплате на сервере;
 *  - двойное бронирование исключается проверкой пересечений внутри serializable-транзакции.
 */
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, notFound } from "@/server/http";
import { bookingInclude } from "@/server/mappers";
import { holdCutoff, isComputerFree } from "@/server/services/availability";

/** Допуск на расхождение часов клиента и сервера. */
const START_GRACE_MS = 5 * 60_000;
const MAX_DAYS_AHEAD = 30;

export interface CreateBookingInput {
  userId: string;
  computerId: string;
  tariffId: string;
  startAt: Date;
}

function generateBookingNumber() {
  return `RON-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function generateBookingCode() {
  return crypto.randomInt(10000, 100000).toString();
}

export async function createBooking(input: CreateBookingInput) {
  const { userId, computerId, tariffId, startAt } = input;

  if (Number.isNaN(startAt.getTime())) throw badRequest("Некорректное время начала");
  const now = Date.now();
  if (startAt.getTime() < now - START_GRACE_MS) throw badRequest("Нельзя забронировать время в прошлом");
  if (startAt.getTime() > now + MAX_DAYS_AHEAD * 24 * 60 * 60_000) {
    throw badRequest(`Бронирование доступно не более чем на ${MAX_DAYS_AHEAD} дней вперёд`);
  }

  try {
    return await prisma.$transaction(
      async (tx) => {
        const [tariff, computer] = await Promise.all([
          tx.tariffs.findUnique({ where: { id: tariffId } }),
          tx.computers.findUnique({ where: { id: computerId }, include: { computer_categories: { select: { is_active: true } } } }),
        ]);

        if (!tariff || !tariff.is_active) throw notFound("Тариф не найден или отключён");
        if (!computer || !computer.computer_categories.is_active) throw notFound("Компьютер не найден");
        if (computer.status === "maintenance") throw conflict("Компьютер на обслуживании", "computer_maintenance");
        if (tariff.category_id && tariff.category_id !== computer.category_id) {
          throw badRequest("Тариф не подходит для этого компьютера");
        }

        const endAt = new Date(startAt.getTime() + tariff.duration_minutes * 60_000);

        if (!(await isComputerFree(computerId, startAt, endAt, tx))) {
          throw conflict("Компьютер уже занят в это время", "computer_busy");
        }

        let bookingCode = generateBookingCode();
        for (let i = 0; i < 5 && (await tx.bookings.findUnique({ where: { booking_code: bookingCode } })); i++) {
          bookingCode = generateBookingCode();
        }

        const createdAt = new Date();
        return tx.bookings.create({
          data: {
            id: crypto.randomUUID(),
            booking_number: generateBookingNumber(),
            booking_code: bookingCode,
            user_id: userId,
            computer_id: computerId,
            tariff_id: tariffId,
            start_at: startAt,
            end_at: endAt,
            duration_minutes: tariff.duration_minutes,
            price: tariff.price,
            status: "pending",
            payment_status: "pending",
            qr_token: crypto.randomBytes(32).toString("hex"),
            created_at: createdAt,
            updated_at: createdAt,
          },
          include: bookingInclude,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (error) {
    // Конкурентная попытка забронировать тот же слот
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      throw conflict("Компьютер только что заняли. Выберите другое время", "computer_busy");
    }
    throw error;
  }
}

/** Отмена брони персоналом или владельцем. Возврат денег — отдельная операция, здесь не выполняется. */
export async function cancelBooking(bookingId: string, changedBy: string, reason?: string) {
  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
  if (!booking) throw notFound("Бронирование не найдено");
  if (booking.status === "cancelled") throw conflict("Бронирование уже отменено");
  if (booking.status === "completed" || booking.status === "expired") {
    throw conflict("Завершённое бронирование нельзя отменить");
  }

  const now = new Date();
  const [updated] = await prisma.$transaction([
    prisma.bookings.update({
      where: { id: bookingId },
      data: { status: "cancelled", updated_at: now },
      include: bookingInclude,
    }),
    prisma.booking_status_history.create({
      data: {
        id: crypto.randomUUID(),
        booking_id: bookingId,
        old_status: booking.status,
        new_status: "cancelled",
        changed_by: changedBy,
        reason: reason || null,
        created_at: now,
      },
    }),
  ]);
  return updated;
}

/**
 * Обслуживание статусов (для cron):
 *  - неоплаченные pending старше срока удержания → expired;
 *  - подтверждённые, время которых закончилось → completed.
 */
export async function expireStaleBookings() {
  const now = new Date();

  const expired = await prisma.bookings.updateMany({
    where: {
      status: "pending",
      created_at: { lte: holdCutoff(now) },
      // payment_status может быть NULL у старых записей — его тоже считаем неоплаченным
      OR: [{ payment_status: null }, { payment_status: { not: "paid" } }],
    },
    data: { status: "expired", is_expired: true, updated_at: now },
  });

  const completed = await prisma.bookings.updateMany({
    where: { status: "confirmed", end_at: { lte: now } },
    data: { status: "completed", updated_at: now },
  });

  return { expired: expired.count, completed: completed.count };
}
