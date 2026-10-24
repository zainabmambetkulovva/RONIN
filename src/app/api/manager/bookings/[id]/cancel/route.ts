import { NextResponse } from "next/server";
import { z } from "zod";
import { handle } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { toBookingDTO } from "@/server/mappers";
import { cancelBooking } from "@/server/services/bookings";
import { notifyUser, writeAuditLog } from "@/server/services/audit";

const schema = z.object({ reason: z.string().trim().max(500).optional() });

// POST /api/manager/bookings/[id]/cancel - отменить бронирование (manager, admin)
export const POST = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);

  // Тело запроса необязательно
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  const reason = parsed.success ? parsed.data.reason : undefined;

  const booking = await cancelBooking(params.id, staff.id, reason || "Отменено менеджером");

  await writeAuditLog({
    userId: staff.id,
    action: "CANCEL_BOOKING",
    entityType: "Booking",
    entityId: params.id,
    newData: { reason: reason || null },
  });
  await notifyUser(
    booking.user_id,
    "booking_cancelled",
    "Бронирование отменено",
    reason
      ? `Бронирование ${booking.booking_number} отменено. Причина: ${reason}`
      : `Бронирование ${booking.booking_number} отменено.`
  );

  return NextResponse.json({ success: true, booking: toBookingDTO(booking) });
});
