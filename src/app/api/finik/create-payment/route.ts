import { NextRequest, NextResponse } from 'next/server';
import { createFinikPayment, CreatePaymentData } from '@/lib/finik';

/**
 * POST /api/finik/create-payment
 * Создает платеж в Finik с фиксированной ценой 5 сом
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Получение данных из запроса
    const body = await request.json();
    const { bookingId, userId } = body;

    // 2. Валидация данных
    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId and userId' },
        { status: 400 }
      );
    }

    // 3. Создание данных для платежа
    const paymentData: CreatePaymentData = {
      bookingId,
      userId,
    };

    console.log(`📝 Creating payment for booking: ${bookingId}, user: ${userId}`);

    // 4. Создание платежа в Finik (5 сом фиксированная цена)
    const paymentUrl = await createFinikPayment(paymentData);

    console.log(`✅ Payment created successfully`);

    // 5. Возврат URL платежной страницы
    return NextResponse.json({
      success: true,
      paymentUrl,
      amount: 5, // Фиксированная цена
    });

  } catch (error: any) {
    console.error('❌ Error creating Finik payment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
