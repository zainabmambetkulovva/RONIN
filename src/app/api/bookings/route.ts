import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// POST /api/bookings - создать новое бронирование
export async function POST(req: NextRequest) {
  try {
    // Получаем сессию пользователя
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { computerId, tariffId, startAt } = body;

    // Validation
    if (!computerId || !tariffId || !startAt) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get tariff info
    const tariff = await prisma.tariffs.findFirst({
      where: { id: tariffId },
    });

    if (!tariff) {
      return NextResponse.json(
        { error: "Tariff not found" },
        { status: 404 }
      );
    }

    // Calculate start and end times
    const startTime = new Date(startAt);
    const endAt = new Date(startTime.getTime() + tariff.duration_minutes * 60000);

    // Check if computer is available (temporarily disabled for testing)
    // TODO: Re-enable after testing payment flow
    const existingBooking = null; // await prisma.bookings.findFirst({
    //   where: {
    //     computer_id: computerId,
    //     status: { in: ["pending", "confirmed"] },
    //     OR: [
    //       {
    //         AND: [
    //           { start_at: { lte: startTime } },
    //           { end_at: { gt: startTime } },
    //         ],
    //       },
    //       {
    //         AND: [
    //           { start_at: { lt: endAt } },
    //           { end_at: { gte: endAt } },
    //         ],
    //       },
    //     ],
    //   },
    // });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Computer is not available at this time" },
        { status: 409 }
      );
    }

    // Generate unique booking number and code
    const bookingNumber = `RON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const bookingCode = Math.random().toString().substring(2, 7); // 5-digit code
    const qrToken = crypto.randomBytes(32).toString("hex");

    // Create booking
    const booking = await prisma.bookings.create({
      data: {
        id: crypto.randomUUID(),
        booking_number: bookingNumber,
        booking_code: bookingCode,
        user_id: session.user.id,
        computer_id: computerId,
        tariff_id: tariffId,
        start_at: startTime,
        end_at: endAt,
        duration_minutes: tariff.duration_minutes,
        price: tariff.price,
        status: "pending",
        qr_token: qrToken,
        payment_status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// GET /api/bookings - получить бронирования пользователя
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.bookings.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({ bookings, total: bookings.length });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
