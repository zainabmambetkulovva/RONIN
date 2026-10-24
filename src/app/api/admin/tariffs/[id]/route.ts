import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, handle, notFound, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { tariffInclude, toTariffDTO } from "@/server/mappers";
import { tariffUpdateSchema, toTariffData } from "@/server/services/tariffs";
import { writeAuditLog } from "@/server/services/audit";

// PATCH /api/admin/tariffs/[id] - изменить тариф (цены существующих броней не меняются)
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, tariffUpdateSchema);
  const data = toTariffData(input);
  if (Object.keys(data).length === 0) throw badRequest("Нет данных для обновления");

  const before = await prisma.tariffs.findUnique({ where: { id: params.id }, include: tariffInclude });
  if (!before) throw notFound("Tariff not found");

  const tariff = await prisma.tariffs.update({
    where: { id: params.id },
    data: { ...data, updated_at: new Date() },
    include: tariffInclude,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_TARIFF",
    entityType: "Tariff",
    entityId: tariff.id,
    oldData: toTariffDTO(before),
    newData: toTariffDTO(tariff),
  });

  return NextResponse.json({ success: true, tariff: toTariffDTO(tariff) });
});

// DELETE /api/admin/tariffs/[id] - удалить тариф, только если по нему нет бронирований
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);

  const tariff = await prisma.tariffs.findUnique({
    where: { id: params.id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!tariff) throw notFound("Tariff not found");
  if (tariff._count.bookings > 0) {
    throw conflict("По тарифу есть бронирования — его можно только отключить", "tariff_in_use");
  }

  await prisma.tariffs.delete({ where: { id: params.id } });

  await writeAuditLog({
    userId: admin.id,
    action: "DELETE_TARIFF",
    entityType: "Tariff",
    entityId: params.id,
    oldData: { name: tariff.name, price: Number(tariff.price), durationMinutes: tariff.duration_minutes },
  });

  return NextResponse.json({ success: true });
});
