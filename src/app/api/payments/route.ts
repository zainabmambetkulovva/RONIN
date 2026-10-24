import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { forbidden, conflict, handle, notFound, parseJson } from "@/server/http";
import { requireUser } from "@/server/auth/session";

const schema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  method: z.string().min(1, "Payment method is required"),
});

/**
 * POST /api/payments - ДЕМО-оплата для локальной разработки.
 *
 * Помечает бронь оплаченной без реального платежа, поэтому включается только
 * переменной окружения ENABLE_DEMO_PAYMENTS=true и никогда не должна быть включена в production.
 * Реальная оплата — Finik (`/api/finik/create-payment` + webhook).
 */
export const POST = handle(async (req) => {
  if (process.env.ENABLE_DEMO_PAYMENTS !== "true" || process.env.NODE_ENV === "production") {
    throw forbidden("Демо-оплата отключена. Используйте оплату через Finik");
  }

  const user = await requireUser();
  const { bookingId, method } = await parseJson(req, schema);

  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
  if (!booking || booking.user_id !== user.id) throw notFound("Booking not found");
  if (booking.status !== "pending") throw conflict("Бронирование уже обработано");

  const now = new Date();
  const transactionId = `DEMO-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const [payment] = await prisma.$transaction([
    prisma.payments.create({
      data: {
        id: crypto.randomUUID(),
        booking_id: bookingId,
        amount: booking.price,
        method: method === "cash" ? "cash" : "electronic_wallet",
        status: "paid",
        provider: `demo:${method}`,
        transaction_id: transactionId,
        paid_at: now,
        created_at: now,
      },
    }),
    prisma.bookings.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
        payment_status: "paid",
        payment_method: `demo:${method}`,
        transaction_id: transactionId,
        paid_at: now,
        updated_at: now,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    payment: { id: payment.id, status: payment.status, amount: Number(payment.amount), transactionId },
    message: "Payment successful (demo mode)",
  });
});
