import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { blockingBookingWhere } from "@/server/services/availability";

export const dynamic = "force-dynamic";

// GET /api/admin/computers - компьютеры с текущей активной бронью (admin, manager)
export const GET = handle(async (req) => {
  await requireStaff(req);
  const now = new Date();

  const computersData = await prisma.computers.findMany({
    include: {
      computer_categories: { select: { id: true, name: true } },
      bookings: {
        where: { AND: [{ start_at: { lte: now }, end_at: { gt: now } }, blockingBookingWhere(now)] },
        orderBy: { start_at: "asc" },
        take: 1,
      },
    },
    orderBy: { number: "asc" },
  });

  const computers = computersData.map((c) => ({
    id: c.id,
    number: c.number,
    name: `Computer ${c.number}`,
    status: c.status,
    /** Операционное состояние: maintenance > occupied > available. */
    state: c.status === "maintenance" ? "maintenance" : c.bookings.length > 0 ? "occupied" : "available",
    category: { id: c.computer_categories.id, name: c.computer_categories.name },
    specs: c.specifications,
    bookings: c.bookings.map((b) => ({
      id: b.id,
      startAt: b.start_at.toISOString(),
      endAt: b.end_at.toISOString(),
      status: b.status,
    })),
  }));

  return NextResponse.json({ computers });
});
