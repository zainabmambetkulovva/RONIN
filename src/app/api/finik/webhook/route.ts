import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyFinikWebhook, 
  isTimestampValid, 
  FinikWebhookData 
} from '@/lib/finik';
import { prisma } from '@/lib/prisma';

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

      // 8. Обновляем статус бронирования в БД
      try {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'paid',
            paymentMethod: 'finik',
            transactionId: body.transactionId,
            paidAt: new Date(body.transactionDate),
          },
        });

        console.log(`💾 Booking ${bookingId} updated: payment status = paid`);

        // Создаем audit log
        try {
          await prisma.auditLog.create({
            data: {
              userId: userId,
              action: 'PAYMENT_SUCCESS',
              entityType: 'Booking',
              entityId: bookingId,
              newData: {
                transactionId: body.transactionId,
                amount: body.amount,
                paymentMethod: 'finik',
              },
            },
          });
        } catch (auditError) {
          console.warn('⚠️ Failed to create audit log:', auditError);
        }

      } catch (dbError: any) {
        console.error('❌ Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update booking status', details: dbError.message },
          { status: 500 }
        );
      }
    } 
    // 9. Обработка неудачного платежа
    else if (body.status === 'FAILED' || body.status === 'failed') {
      const { userId, bookingId } = metadata;
      console.error(`❌ Payment failed for booking: ${bookingId}`);
      
      // Обновляем статус на failed
      if (bookingId) {
        try {
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: 'failed',
            },
          });
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
