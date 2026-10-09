import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/manager/bookings/[id]/cancel - отменить бронирование (Manager)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Get actual manager ID from session
    const managerId = "mock-user-id"; // Replace with actual auth

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true },
        },
        computer: {
          select: { number: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled" || booking.status === "completed" || booking.status === "expired") {
      return NextResponse.json(
        { error: "Cannot cancel this booking" },
        { status: 400 }
      );
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "cancelled",
        updatedAt: new Date(),
      },
    });

    // Add status history
    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: params.id,
        oldStatus: booking.status,
        newStatus: "cancelled",
        changedBy: managerId,
        reason: "Cancelled by manager",
      },
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: "booking_cancelled",
        title: "Бронирование отменено",
        message: `Ваше бронирование ПК #${booking.computer.number} (код: ${booking.bookingCode}) было отменено менеджером.`,
        isRead: false,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: managerId,
        action: "CANCEL_BOOKING",
        entityType: "Booking",
        entityId: params.id,
        oldData: { status: booking.status },
        newData: { status: "cancelled" },
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
