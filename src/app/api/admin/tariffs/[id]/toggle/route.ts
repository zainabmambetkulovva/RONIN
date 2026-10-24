import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, notFound } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { tariffInclude, toTariffDTO } from "@/server/mappers";
import { writeAuditLog } from "@/server/services/audit";

// PATCH /api/admin/tariffs/[id]/toggle - включить / отключить тариф
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);

  const tariff = await prisma.tariffs.findUnique({ where: { id: params.id } });
  if (!tariff) throw notFound("Tariff not found");

  const updated = await prisma.tariffs.update({
    where: { id: params.id },
    data: { is_active: !tariff.is_active, updated_at: new Date() },
    include: tariffInclude,
  });

  await writeAuditLog({
    userId: admin.id,
    action: updated.is_active ? "ENABLE_TARIFF" : "DISABLE_TARIFF",
    entityType: "Tariff",
    entityId: params.id,
  });

  return NextResponse.json({ success: true, tariff: toTariffDTO(updated) });
});
