import { NextResponse } from "next/server";
import { z } from "zod";
import { handle, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { toBookingDTO } from "@/server/mappers";
import { recordOfflinePayment } from "@/server/services/payments";
import { writeAuditLog } from "@/server/services/audit";

const schema = z.object({
  method: z.enum(["cash", "card", "qr"], { message: "Способ оплаты: cash, card или qr" }),
});

/**
 * POST /api/admin/bookings/[id]/payment — оплата в клубе (наличные, карта, QR).
 * Проводит сотрудник; бронь подтверждается, оплата записывается в журнал платежей.
 */
export const POST = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const { method } = await parseJson(req, schema);

  const result = await recordOfflinePayment(params.id, method, staff.id);

  await writeAuditLog({
    userId: staff.id,
    action: result.outcome === "conflict" ? "OFFLINE_PAYMENT_CONFLICT" : "OFFLINE_PAYMENT",
    entityType: "Booking",
    entityId: params.id,
    newData: { method, amount: Number(result.booking.price), outcome: result.outcome },
  });

  return NextResponse.json({ success: true, outcome: result.outcome, booking: toBookingDTO(result.booking) });
});
