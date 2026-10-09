import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// POST /api/payments - создать платеж (демо-версия)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, method } = body;

    if (!bookingId || !method) {
      return NextResponse.json(
        { error: "Booking ID and payment method are required" },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Map method to payment method enum
    const methodMap: Record<string, string> = {
      mbank: "electronic_wallet",
      o: "electronic_wallet",
      optima: "electronic_wallet",
      bakai: "electronic_wallet",
      cash: "cash",
    };

    const paymentMethod = methodMap[method] || "electronic_wallet";

    // Create payment (demo - automatically mark as paid)
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.price,
        method: paymentMethod as any,
        status: "paid", // In real system, this would be "pending" initially
        provider: method,
        transactionId: `DEMO-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        paidAt: new Date(),
      },
    });

    // Update booking status to confirmed
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "confirmed" },
    });

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment successful (demo mode)",
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
