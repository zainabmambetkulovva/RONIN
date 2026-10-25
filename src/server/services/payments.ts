/**
 * Подтверждение оплаты бронирований.
 *
 * Источники оплаты:
 *  - Finik (онлайн, подтверждается только серверным webhook с проверкой подписи);
 *  - оплата в клубе (наличные / карта / QR), которую проводит сотрудник.
 *
 * Правила:
 *  - бронь становится confirmed только здесь;
 *  - повторное уведомление о том же платеже ничего не меняет (идемпотентность);
 *  - если оплата пришла, когда бронь уже отменена или компьютер успели занять,
 *    бронь не подтверждается автоматически — возвращается conflict для ручного решения.
 */
import crypto from "crypto";
import { Prisma, type PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { conflict, notFound } from "@/server/http";
import { bookingInclude } from "@/server/mappers";
import { isComputerFree } from "@/server/services/availability";

export type OfflinePaymentMethod = "cash" | "card" | "qr";

export interface MarkPaidInput {
  bookingId: string;
  amount: number;
  transactionId: string;
  paidAt: Date;
  /** Например "finik", "offline:cash". */
  provider: string;
  method: PaymentMethod;
  /** Кто инициировал смену статуса (клиент для онлайн-оплаты, сотрудник для оплаты в клубе). */
  changedBy: string;
}

export type MarkPaidResult =
  | { outcome: "confirmed" | "already_paid"; booking: Prisma.bookingsGetPayload<{ include: typeof bookingInclude }> }
  | { outcome: "conflict"; reason: "booking_cancelled" | "computer_taken"; booking: Prisma.bookingsGetPayload<{ include: typeof bookingInclude }> };

export async function markBookingPaid(input: MarkPaidInput): Promise<MarkPaidResult> {
  return prisma.$transaction(
    async (tx) => {
      const booking = await tx.bookings.findUnique({ where: { id: input.bookingId } });
      if (!booking) throw notFound("Бронирование не найдено");

      // Повтор того же уведомления
      const duplicate = await tx.payments.findFirst({
        where: { booking_id: booking.id, transaction_id: input.transactionId, status: "paid" },
        select: { id: true },
      });
      if (duplicate || (booking.payment_status === "paid" && booking.transaction_id === input.transactionId)) {
        const current = await tx.bookings.findUniqueOrThrow({ where: { id: booking.id }, include: bookingInclude });
        return { outcome: "already_paid" as const, booking: current };
      }

      const now = new Date();
      await tx.payments.create({
        data: {
          id: crypto.randomUUID(),
          booking_id: booking.id,
          amount: input.amount,
          method: input.method,
          status: "paid",
          provider: input.provider,
          transaction_id: input.transactionId,
          paid_at: input.paidAt,
          created_at: now,
        },
      });

      // Можно ли подтвердить бронь
      let reason: "booking_cancelled" | "computer_taken" | null = null;
      if (booking.status === "cancelled") {
        reason = "booking_cancelled";
      } else if (booking.status === "pending" || booking.status === "expired") {
        const free = await isComputerFree(booking.computer_id, booking.start_at, booking.end_at, tx, booking.id);
        if (!free) reason = "computer_taken";
      }

      const newStatus = reason ? booking.status : booking.status === "completed" ? "completed" : "confirmed";

      const updated = await tx.bookings.update({
        where: { id: booking.id },
        data: {
          payment_status: "paid",
          payment_method: input.provider,
          transaction_id: input.transactionId,
          paid_at: input.paidAt,
          status: newStatus,
          ...(newStatus === "confirmed" ? { is_expired: false } : {}),
          updated_at: now,
        },
        include: bookingInclude,
      });

      if (newStatus !== booking.status) {
        await tx.booking_status_history.create({
          data: {
            id: crypto.randomUUID(),
            booking_id: booking.id,
            old_status: booking.status,
            new_status: newStatus,
            changed_by: input.changedBy,
            reason: `Оплата подтверждена (${input.provider})`,
            created_at: now,
          },
        });
      }

      return reason
        ? { outcome: "conflict" as const, reason, booking: updated }
        : { outcome: "confirmed" as const, booking: updated };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

/** Неуспешная оплата: отмечается, только если бронь ещё не оплачена. */
export async function markBookingPaymentFailed(bookingId: string) {
  await prisma.bookings.updateMany({
    where: { id: bookingId, OR: [{ payment_status: null }, { payment_status: { not: "paid" } }] },
    data: { payment_status: "failed", updated_at: new Date() },
  });
}

/** Оплата в клубе, проведённая сотрудником. */
export async function recordOfflinePayment(bookingId: string, method: OfflinePaymentMethod, staffId: string) {
  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
  if (!booking) throw notFound("Бронирование не найдено");
  if (booking.payment_status === "paid") throw conflict("Бронирование уже оплачено", "already_paid");
  if (booking.status === "cancelled" || booking.status === "completed") {
    throw conflict("Нельзя оплатить отменённое или завершённое бронирование", "invalid_status");
  }
  // Проверяем до записи оплаты, чтобы сотрудник не принял деньги за занятый слот
  if (!(await isComputerFree(booking.computer_id, booking.start_at, booking.end_at, prisma, booking.id))) {
    throw conflict("Компьютер на это время уже занят — выберите другое время или компьютер", "computer_taken");
  }

  const result = await markBookingPaid({
    bookingId,
    amount: Number(booking.price),
    transactionId: `OFFLINE-${method.toUpperCase()}-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    paidAt: new Date(),
    provider: `offline:${method}`,
    method: method === "cash" ? "cash" : "electronic_wallet",
    changedBy: staffId,
  });

  // conflict здесь возможен только при гонке с другой бронью — запись об оплате остаётся для сверки кассы
  return result;
}
