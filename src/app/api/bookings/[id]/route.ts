import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, notFound, unauthorized } from "@/server/http";
import { getSessionUser } from "@/server/auth/session";
import { getStaffUser } from "@/server/auth/staff";
import { bookingInclude, toBookingDTO } from "@/server/mappers";

export const dynamic = "force-dynamic";

// GET /api/bookings/[id] - бронь доступна только её владельцу и персоналу
export const GET = handle<{ id: string }>(async (req, { params }) => {
  const [user, staff] = await Promise.all([getSessionUser(), getStaffUser(req)]);
  if (!user && !staff) throw unauthorized();

  const booking = await prisma.bookings.findUnique({ where: { id: params.id }, include: bookingInclude });

  // Чужая бронь для клиента выглядит как несуществующая
  if (!booking || (!staff && booking.user_id !== user?.id)) throw notFound("Бронирование не найдено");

  return NextResponse.json({ booking: toBookingDTO(booking) });
});
