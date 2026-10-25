import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, handle } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import type { PaymentDTO } from "@/types/api";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "paid", "failed", "refunded"] as const;

/**
 * GET /api/admin/payments — журнал платежей (только admin). Только просмотр:
 * статус платежа меняют webhook Finik и оплата в клубе, а не ручное редактирование.
 * Фильтры: ?status=, ?source=online|offline, ?from=&to= (ISO), ?q= (код или номер брони)
 */
export const GET = handle(async (req) => {
  await requireAdmin(req);
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.paymentsWhereInput = {};
  if (status && status !== "all") {
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw badRequest("Некорректный статус");
    where.status = status as (typeof STATUSES)[number];
  }
  if (source === "offline") where.provider = { startsWith: "offline:" };
  if (source === "online") where.NOT = { provider: { startsWith: "offline:" } };
  if (from || to) {
    where.created_at = { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lt: new Date(to) } : {}) };
  }
  if (q) where.bookings = { OR: [{ booking_code: q }, { booking_number: { contains: q, mode: "insensitive" } }] };

  const payments = await prisma.payments.findMany({
    where,
    include: {
      bookings: {
        select: { id: true, booking_code: true, booking_number: true, price: true, status: true, users: { select: { id: true, name: true, phone: true } } },
      },
    },
    orderBy: { created_at: "desc" },
    take: 500,
  });

  const items: PaymentDTO[] = payments.map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    status: p.status,
    method: p.method,
    provider: p.provider,
    transactionId: p.transaction_id,
    paidAt: p.paid_at?.toISOString() ?? null,
    refundedAt: p.refunded_at?.toISOString() ?? null,
    createdAt: p.created_at.toISOString(),
    booking: {
      id: p.bookings.id,
      bookingCode: p.bookings.booking_code,
      bookingNumber: p.bookings.booking_number,
      price: Number(p.bookings.price),
      status: p.bookings.status,
    },
    client: { id: p.bookings.users.id, name: p.bookings.users.name, phone: p.bookings.users.phone },
  }));

  const total = items.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  return NextResponse.json({ payments: items, total: items.length, paidAmount: total });
});
