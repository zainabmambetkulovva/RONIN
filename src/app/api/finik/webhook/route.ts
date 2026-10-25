import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyFinikWebhook, 
  isTimestampValid, 
  FinikWebhookData 
} from '@/lib/finik';
import { prisma } from '@/lib/prisma';
import { markBookingPaid, markBookingPaymentFailed } from '@/server/services/payments';
import { writeAuditLog } from '@/server/services/audit';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * POST /api/finik/webhook
 * Обрабатывает webhook от Finik после завершения платежа
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Получение заголовков
    const signature = request.headers.get('signature');
    const timestamp = request.headers.get('x-api-timestamp');
    const host = request.headers.get('host');

    console.log('📥 Received Finik webhook');

    if (!signature || !timestamp) {
      console.error('❌ Missing signature or timestamp in webhook');
      return NextResponse.json(
        { error: 'Missing signature or timestamp' },
        { status: 400 }
      );
    }

    // 2. Проверка актуальности timestamp (защита от replay-атак)
    if (!isTimestampValid(timestamp)) {
      console.error('❌ Webhook timestamp is too old or invalid');
      return NextResponse.json(
        { error: 'Invalid timestamp' },
        { status: 400 }
      );
    }

    // 3. Получение тела запроса
    const body: FinikWebhookData = await request.json();

    console.log(`📋 Webhook data: status=${body.status}, transactionId=${body.transactionId}, amount=${body.amount}`);

    // 4. Подготовка заголовков для верификации
    const headers: Record<string, string> = {
      'host': host || '',
    };

    // 5. Верификация подписи
    const webhookPath = '/api/finik/webhook';
    const isValid = await verifyFinikWebhook(
      signature, 
      timestamp, 
      body as any, 
      headers, 
      webhookPath
    );
    
    if (!isValid) {
      console.error('⚠️ Invalid webhook signature');
      
      // В продакшене всегда отклоняем невалидные подписи
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('⚠️ Continuing in dev mode despite invalid signature');
    }

    // 6. Извлечение метаданных
    let metadata: { 
      userId?: string; 
      bookingId?: string; 
      paymentId?: string;
      amount?: number;
    } = {};
    
    try {
      if (body.data && body.data.metadata) {
        if (typeof body.data.metadata === 'string') {
          metadata = JSON.parse(body.data.metadata);
        } else {
          metadata = body.data.metadata as typeof metadata;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing metadata:', error);
    }

    // 7. Обработка успешного платежа
    if (body.status === 'SUCCEEDED' || body.status === 'succeeded') {
      const { userId, bookingId } = metadata;

      if (!userId || !bookingId) {
        console.error('❌ Missing userId or bookingId in metadata');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      console.log(`✅ Payment succeeded for booking: ${bookingId}`);

      // 8. Подтверждаем оплату: бронь -> confirmed, запись в payments (идемпотентно)
      try {
        const booking = await prisma.bookings.findUnique({ where: { id: bookingId }, select: { user_id: true } });
        if (!booking) {
          console.error(`❌ Booking ${bookingId} from webhook metadata not found`);
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const result = await markBookingPaid({
          bookingId,
          amount: Number(body.amount),
          transactionId: body.transactionId,
          paidAt: body.transactionDate ? new Date(body.transactionDate) : new Date(),
          provider: 'finik',
          method: 'electronic_wallet',
          changedBy: booking.user_id,
        });

        console.log(`💾 Booking ${bookingId}: ${result.outcome}`);

        await writeAuditLog({
          userId: booking.user_id,
          action: result.outcome === 'conflict' ? 'PAYMENT_CONFLICT' : 'PAYMENT_SUCCESS',
          entityType: 'Booking',
          entityId: bookingId,
          newData: {
            transactionId: body.transactionId,
            amount: body.amount,
            paymentMethod: 'finik',
            outcome: result.outcome,
            ...(result.outcome === 'conflict' ? { reason: result.reason } : {}),
          },
        });

        // Оплата прошла, но бронь отменена или ПК занят — нужен ручной разбор (возврат/перенос)
        if (result.outcome === 'conflict' && process.env.TELEGRAM_ADMIN_CHAT_ID) {
          sendTelegramMessage(
            process.env.TELEGRAM_ADMIN_CHAT_ID,
            `⚠️ <b>Оплата требует проверки</b>\nБронь: ${result.booking.booking_number}\nТранзакция Finik: ${body.transactionId}\nПричина: ${
              result.reason === 'booking_cancelled' ? 'бронь была отменена' : 'компьютер уже занят на это время'
            }`
          ).catch((e) => console.error('Failed to send Telegram conflict alert:', e));
        }
      } catch (dbError: any) {
        console.error('❌ Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }
    } 
    // 9. Обработка неудачного платежа
    else if (body.status === 'FAILED' || body.status === 'failed') {
      const { userId, bookingId } = metadata;
      console.error(`❌ Payment failed for booking: ${bookingId}`);
      
      // Обновляем статус на failed (если бронь ещё не оплачена)
      if (bookingId) {
        try {
          await markBookingPaymentFailed(bookingId);
          console.log(`💾 Booking ${bookingId} updated: payment status = failed`);
        } catch (dbError) {
          console.error('❌ Failed to update booking status:', dbError);
        }
      }
    }

    // 10. Возврат успешного ответа
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Error processing Finik webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
