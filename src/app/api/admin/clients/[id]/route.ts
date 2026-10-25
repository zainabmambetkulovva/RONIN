import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, notFound } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { bookingInclude, toBookingDTO } from "@/server/mappers";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/clients/[id] — профиль клиента и история броней (admin, manager).
 * Подробности платежей (транзакции) — только администратору.
 */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const client = await prisma.users.findFirst({
    where: { id: params.id, role: "client" },
    select: { id: true, name: true, email: true, phone: true, status: true, created_at: true },
  });
  if (!client) throw notFound("Клиент не найден");

  const bookings = await prisma.bookings.findMany({
    where: { user_id: params.id },
    include: bookingInclude,
    orderBy: { start_at: "desc" },
    take: 100,
  });

  const items = bookings.map((b) => {
    const dto = toBookingDTO(b, { includeUser: false });
    return staff.role === "admin" ? dto : { ...dto, payments: undefined };
  });

  return NextResponse.json({
    client: { ...client, createdAt: client.created_at.toISOString(), created_at: undefined },
    bookings: items,
    totals: {
      bookings: bookings.length,
      paidAmount: staff.role === "admin" ? bookings.filter((b) => b.payment_status === "paid").reduce((s, b) => s + Number(b.price), 0) : null,
    },
  });
});
