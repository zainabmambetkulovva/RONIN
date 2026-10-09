import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



/**
 * Cron job endpoint для автоматической отмены истекших бронирований
 * Должен запускаться каждые 5-10 минут
 * 
 * В production можно использовать:
 * - Vercel Cron Jobs
 * - GitHub Actions
 * - External cron service (cron-job.org)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security (optional)
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET || "dev-secret-key";
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find all bookings that have ended and are still active
    const expiredBookings = await prisma.booking.findMany({
      where: {
        endAt: {
          lt: now,
        },
        status: {
          in: ["pending", "confirmed"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        computer: {
          select: {
            number: true,
          },
        },
      },
    });

    // Mark bookings as expired
    const updatePromises = expiredBookings.map(async (booking) => {
      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "expired",
        },
      });

      // Add status history
      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          oldStatus: booking.status,
          newStatus: "expired",
          changedBy: "system", // System user ID or special marker
          reason: "Booking time has expired automatically",
        },
      });

      // Create notification for user
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          type: "booking_expired",
          title: "Бронирование истекло",
          message: `Ваше бронирование ПК #${booking.computer.number} (код: ${booking.bookingNumber}) истекло.`,
          isRead: false,
        },
      });

      return booking.id;
    });

    const updatedIds = await Promise.all(updatePromises);

    console.log(`[CRON] Expired ${updatedIds.length} bookings at ${now.toISOString()}`);

    return NextResponse.json({
      success: true,
      expiredCount: updatedIds.length,
      expiredBookingIds: updatedIds,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error expiring bookings:", error);
    return NextResponse.json(
      {
        error: "Failed to expire bookings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint (POST)
 * For testing or manual execution
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
