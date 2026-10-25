import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { forbidden, handle, notFound, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { bookingInclude, toBookingDTO } from "@/server/mappers";
import { computerUpdateSchema, setComputerStatus, updateComputer } from "@/server/services/computers";
import { sessionInclude, toSessionDTO } from "@/server/services/sessions";
import { writeAuditLog } from "@/server/services/audit";

// GET /api/admin/computers/[id] — ПК, ближайшие брони и последние сессии (admin, manager)
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireStaff(req);
  const computer = await prisma.computers.findUnique({
    where: { id: params.id },
    include: { computer_categories: { select: { id: true, name: true } } },
  });
  if (!computer) throw notFound("Компьютер не найден");

  const now = new Date();
  const [bookings, sessions] = await Promise.all([
    prisma.bookings.findMany({
      where: { computer_id: params.id, end_at: { gt: new Date(now.getTime() - 24 * 60 * 60_000) } },
      include: bookingInclude,
      orderBy: { start_at: "asc" },
      take: 20,
    }),
    prisma.gaming_sessions.findMany({ where: { computer_id: params.id }, include: sessionInclude, orderBy: { started_at: "desc" }, take: 10 }),
  ]);

  return NextResponse.json({
    computer: {
      id: computer.id,
      number: computer.number,
      status: computer.status,
      category: computer.computer_categories,
      specifications: computer.specifications,
    },
    bookings: bookings.map((b) => toBookingDTO(b)),
    sessions: sessions.map(toSessionDTO),
  });
});

const patchSchema = computerUpdateSchema.extend({ status: z.enum(["available", "maintenance"]).optional() });

/**
 * PATCH /api/admin/computers/[id]
 *  - status (обслуживание) — admin и manager;
 *  - номер, зал, характеристики — только admin.
 */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const { status, ...fields } = await parseJson(req, patchSchema);
  const editsFields = Object.values(fields).some((v) => v !== undefined);
  if (editsFields && staff.role !== "admin") throw forbidden("Изменять данные компьютера может только администратор");

  let upcomingBookings = 0;
  if (editsFields) {
    await updateComputer(params.id, fields);
    await writeAuditLog({ userId: staff.id, action: "UPDATE_COMPUTER", entityType: "Computer", entityId: params.id, newData: fields });
  }
  if (status) {
    const before = await prisma.computers.findUnique({ where: { id: params.id }, select: { status: true } });
    const result = await setComputerStatus(params.id, status);
    upcomingBookings = result.upcomingBookings;
    await writeAuditLog({
      userId: staff.id,
      action: status === "maintenance" ? "COMPUTER_MAINTENANCE_ON" : "COMPUTER_MAINTENANCE_OFF",
      entityType: "Computer",
      entityId: params.id,
      oldData: { status: before?.status },
      newData: { status },
    });
  }

  const computer = await prisma.computers.findUniqueOrThrow({ where: { id: params.id } });
  return NextResponse.json({ success: true, computer: { id: computer.id, number: computer.number, status: computer.status }, upcomingBookings });
});
