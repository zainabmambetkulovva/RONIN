import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    
    // Получить все компьютеры с АКТИВНЫМИ бронированиями
    const computersData = await prisma.computers.findMany({
      include: {
        bookings: {
          where: {
            status: {
              in: ["confirmed"],
            },
            start_at: {
              lte: now,
            },
            end_at: {
              gte: now,
            },
          },
          orderBy: {
            start_at: "asc",
          },
          take: 1,
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    // Transform для frontend
    const computers = computersData.map((c) => ({
      id: c.id,
      number: c.number,
      name: `Computer ${c.number}`,
      status: c.status,
      specs: c.specifications,
      bookings: c.bookings.map((b) => ({
        id: b.id,
        startAt: b.start_at,
        endAt: b.end_at,
        status: b.status,
      })),
    }));

    return NextResponse.json({ computers });
  } catch (error) {
    console.error("Error fetching computers:", error);
    return NextResponse.json(
      { error: "Failed to fetch computers" },
      { status: 500 }
    );
  }
}
