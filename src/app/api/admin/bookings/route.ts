import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withAdminProtection } from "@/lib/with-admin-protection";



// GET /api/admin/bookings - получить все бронирования
export async function GET(req: NextRequest) {
  // Protect admin endpoint
  const adminCheck = await withAdminProtection(req);
  if (adminCheck.error) return adminCheck.response;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const bookingCode = searchParams.get("code"); // Поиск по 5-значному коду

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (bookingCode) {
      where.bookingCode = bookingCode;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
            category: {
              select: {
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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

// POST /api/admin/bookings - создать бронирование (для менеджера когда клиент приходит)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, computerId, tariffId, startAt } = body;

    if (!userId || !computerId || !tariffId || !startAt) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Получить тариф для расчета
    const tariff = await prisma.tariff.findUnique({
      where: { id: tariffId },
    });

    if (!tariff) {
      return NextResponse.json({ error: "Tariff not found" }, { status: 404 });
    }

    const start = new Date(startAt);
    const end = new Date(start.getTime() + tariff.durationMinutes * 60000);

    // Генерация 5-значного кода
    const bookingCode = Math.floor(10000 + Math.random() * 90000).toString();

    // Генерация номера бронирования
    const bookingNumber = `RON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // QR токен
    const qrToken = `${bookingNumber}-${Date.now()}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        bookingCode,
        userId,
        computerId,
        tariffId,
        startAt: start,
        endAt: end,
        durationMinutes: tariff.durationMinutes,
        price: tariff.price,
        qrToken,
        status: "confirmed",
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
            category: {
              select: {
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
          },
        },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
