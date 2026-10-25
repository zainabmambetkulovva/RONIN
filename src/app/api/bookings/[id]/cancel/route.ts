import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { conflict, handle, notFound } from "@/server/http";
import { requireUser } from "@/server/auth/session";
import { toBookingDTO } from "@/server/mappers";
import { cancelBooking } from "@/server/services/bookings";

/**
 * POST /api/bookings/[id]/cancel — клиент отменяет свою неоплаченную бронь (компьютер сразу освобождается).
 * Оплаченную бронь клиент сам не отменяет: возврат денег решает клуб.
 */
export const POST = handle<{ id: string }>(async (_req, { params }) => {
  const user = await requireUser();

  const booking = await prisma.bookings.findUnique({ where: { id: params.id } });
  if (!booking || booking.user_id !== user.id) throw notFound("Бронирование не найдено");
  if (booking.payment_status === "paid") {
    throw conflict("Оплаченную бронь можно отменить только через администратора клуба", "paid_booking");
  }
  if (booking.status !== "pending") throw conflict("Эту бронь нельзя отменить", "invalid_status");

  const cancelled = await cancelBooking(booking.id, user.id, "Отменено клиентом");
  return NextResponse.json({ success: true, booking: toBookingDTO(cancelled, { includeUser: false }) });
});
