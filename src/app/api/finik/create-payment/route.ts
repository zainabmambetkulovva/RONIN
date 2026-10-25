import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createFinikPayment, CreatePaymentData } from '@/lib/finik';
import { prisma } from '@/lib/prisma';
import { conflict, handle, notFound, parseJson } from '@/server/http';
import { requireUser } from '@/server/auth/session';
import { holdCutoff } from '@/server/services/availability';

const schema = z.object({
  bookingId: z.string().min(1, 'Missing required fields: bookingId'),
});

/**
 * POST /api/finik/create-payment
 * Создает платеж в Finik для своей неоплаченной брони.
 * Пользователь берётся из сессии (а не из тела запроса); сумма и подпись — в src/lib/finik.ts без изменений.
 */
export const POST = handle(async (request: NextRequest) => {
  const user = await requireUser();
  const { bookingId } = await parseJson(request, schema);

  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
  if (!booking || booking.user_id !== user.id) throw notFound('Бронирование не найдено');
  if (booking.payment_status === 'paid') throw conflict('Бронирование уже оплачено', 'already_paid');
  if (booking.status !== 'pending') throw conflict('Бронирование нельзя оплатить в текущем статусе', 'invalid_status');
  if (booking.created_at <= holdCutoff()) {
    throw conflict('Время на оплату истекло. Создайте бронирование заново', 'hold_expired');
  }

  const paymentData: CreatePaymentData = { bookingId, userId: user.id };

  console.log(`📝 Creating payment for booking: ${bookingId}`);
  const paymentUrl = await createFinikPayment(paymentData);
  console.log(`✅ Payment created successfully`);

  return NextResponse.json({
    success: true,
    paymentUrl,
    amount: 5, // Фиксированная цена (см. src/lib/finik.ts)
  });
});
