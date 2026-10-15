import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/bookings/[id] - получить конкретное бронирование
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔍 GET /api/bookings/[id] - Searching for booking ID:", params.id);
    
    const booking = await prisma.bookings.findUnique({
      where: { id: params.id },
      include: {
        computers: {
          include: {
            computer_categories: true,
          },
        },
        tariffs: true,
        payments: true,
      },
    });

    if (!booking) {
      console.error("❌ Booking not found in database for ID:", params.id);
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    console.log("✅ Booking found:", {
      id: booking.id,
      bookingNumber: booking.booking_number,
      computerNumber: booking.computers.number,
      tariffName: booking.tariffs.name,
    });

    // Transform to match expected format
    const transformedBooking = {
      id: booking.id,
      bookingNumber: booking.booking_number,
      bookingCode: booking.booking_code,
      startAt: booking.start_at,
      endAt: booking.end_at,
      durationMinutes: booking.duration_minutes,
      price: booking.price,
      status: booking.status,
      computer: {
        id: booking.computers.id,
        number: booking.computers.number,
        category: {
          id: booking.computers.computer_categories.id,
          name: booking.computers.computer_categories.name,
        },
      },
      tariff: {
        id: booking.tariffs.id,
        name: booking.tariffs.name,
      },
    };

    return NextResponse.json({ booking: transformedBooking });
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
