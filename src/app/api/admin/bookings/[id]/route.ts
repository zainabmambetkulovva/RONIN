import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { conflict, handle, notFound, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { bookingInclude, toBookingDTO } from "@/server/mappers";
import { cancelBooking } from "@/server/services/bookings";
import { notifyUser, writeAuditLog } from "@/server/services/audit";

// GET /api/admin/bookings/[id]
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireStaff(req);
  const booking = await prisma.bookings.findUnique({ where: { id: params.id }, include: bookingInclude });
  if (!booking) throw notFound("Booking not found");
  return NextResponse.json({ booking: toBookingDTO(booking) });
});

// DELETE /api/admin/bookings/[id] - отменить бронирование (возврат денег — отдельная операция)
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const booking = await cancelBooking(params.id, staff.id, "Отменено персоналом");

  await writeAuditLog({ userId: staff.id, action: "CANCEL_BOOKING", entityType: "Booking", entityId: params.id });
  await notifyUser(
    booking.user_id,
    "booking_cancelled",
    "Бронирование отменено",
    `Бронирование ${booking.booking_number} отменено.`
  );

  return NextResponse.json({ success: true, booking: toBookingDTO(booking) });
});

const patchSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]).optional(),
  reason: z.string().trim().max(500).optional(),
});

/**
 * PATCH /api/admin/bookings/[id] - изменить статус по правилам:
 *  - confirmed — только если оплата подтверждена (payment_status = paid);
 *  - completed — только из confirmed;
 *  - cancelled — как DELETE.
 */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const { status, reason } = await parseJson(req, patchSchema);

  const booking = await prisma.bookings.findUnique({ where: { id: params.id } });
  if (!booking) throw notFound("Booking not found");

  if (!status || status === booking.status) {
    const current = await prisma.bookings.findUniqueOrThrow({ where: { id: params.id }, include: bookingInclude });
    return NextResponse.json({ booking: toBookingDTO(current) });
  }

  if (status === "cancelled") {
    const cancelled = await cancelBooking(params.id, staff.id, reason || "Отменено персоналом");
    await writeAuditLog({ userId: staff.id, action: "CANCEL_BOOKING", entityType: "Booking", entityId: params.id });
    return NextResponse.json({ booking: toBookingDTO(cancelled) });
  }

  if (status === "confirmed" && booking.payment_status !== "paid") {
    throw conflict("Нельзя подтвердить бронь без подтверждённой оплаты", "payment_required");
  }
  if (status === "completed" && booking.status !== "confirmed") {
    throw conflict("Завершить можно только подтверждённую бронь", "invalid_transition");
  }

  const now = new Date();
  const [updated] = await prisma.$transaction([
    prisma.bookings.update({
      where: { id: params.id },
      data: { status, updated_at: now },
      include: bookingInclude,
    }),
    prisma.booking_status_history.create({
      data: {
        id: crypto.randomUUID(),
        booking_id: params.id,
        old_status: booking.status,
        new_status: status,
        changed_by: staff.id,
        reason: reason || null,
        created_at: now,
      },
    }),
  ]);

  await writeAuditLog({
    userId: staff.id,
    action: "UPDATE_BOOKING_STATUS",
    entityType: "Booking",
    entityId: params.id,
    oldData: { status: booking.status },
    newData: { status },
  });

  return NextResponse.json({ booking: toBookingDTO(updated) });
});
