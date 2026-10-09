import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/bookings/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        computer: {
          select: {
            id: true,
            number: true,
            specifications: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tariff: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMinutes: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/[id] - отменить бронирование
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: BookingStatus.cancelled,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/bookings/[id] - обновить статус
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, isExpired } = body;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status: status as BookingStatus }),
        ...(isExpired !== undefined && { isExpired }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        computer: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
