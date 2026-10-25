import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, handle, notFound, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { bookingInclude, toBookingDTO } from "@/server/mappers";
import { createBooking } from "@/server/services/bookings";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "cancelled", "completed", "expired"] as const;

/**
 * GET /api/admin/bookings - все бронирования (admin, manager)
 * Фильтры: ?status=, ?code= (5-значный код), ?q= (код, номер, имя/телефон клиента),
 * ?from=&to= (ISO, по времени начала), ?userId=, ?computerId=
 */
export const GET = handle(async (req) => {
  await requireStaff(req);

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const code = searchParams.get("code")?.trim();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const userId = searchParams.get("userId");
  const computerId = searchParams.get("computerId");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.bookingsWhereInput = {};
  if (status && status !== "all") {
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw badRequest("Некорректный статус");
    where.status = status as (typeof STATUSES)[number];
  }
  if (code) where.booking_code = code;
  if (userId) where.user_id = userId;
  if (computerId) where.computer_id = computerId;
  if (q) {
    where.OR = [
      { booking_code: q },
      { booking_number: { contains: q, mode: "insensitive" } },
      { users: { name: { contains: q, mode: "insensitive" } } },
      { users: { phone: { contains: q.replace(/\s/g, "") } } },
    ];
  }
  if (from || to) {
    const range: Prisma.DateTimeFilter = {};
    if (from) range.gte = new Date(from);
    if (to) range.lt = new Date(to);
    if (Object.values(range).some((d) => Number.isNaN((d as Date).getTime()))) throw badRequest("Некорректный период");
    where.start_at = range;
  }

  const bookings = await prisma.bookings.findMany({
    where,
    include: bookingInclude,
    orderBy: from || to ? { start_at: "asc" } : { created_at: "desc" },
    take: 500,
  });

  const items = bookings.map((b) => toBookingDTO(b));
  return NextResponse.json({ bookings: items, total: items.length });
});

const createSchema = z.object({
  userId: z.string().min(1, "All fields are required"),
  computerId: z.string().min(1, "All fields are required"),
  tariffId: z.string().min(1, "All fields are required"),
  startAt: z.coerce.date({ errorMap: () => ({ message: "Некорректное время начала" }) }),
});

/**
 * POST /api/admin/bookings - создать бронь для клиента (admin, manager).
 * Бронь создаётся в статусе pending, как и онлайн-бронь: подтверждение — только после оплаты.
 */
export const POST = handle(async (req) => {
  const staff = await requireStaff(req);
  const input = await parseJson(req, createSchema);

  const client = await prisma.users.findUnique({ where: { id: input.userId }, select: { id: true, status: true } });
  if (!client || client.status !== "active") throw notFound("Клиент не найден или заблокирован");

  const booking = await createBooking(input);

  await writeAuditLog({
    userId: staff.id,
    action: "CREATE_BOOKING_FOR_CLIENT",
    entityType: "Booking",
    entityId: booking.id,
    newData: { userId: input.userId, computerId: input.computerId, tariffId: input.tariffId },
  });

  return NextResponse.json({ booking: toBookingDTO(booking) }, { status: 201 });
});
