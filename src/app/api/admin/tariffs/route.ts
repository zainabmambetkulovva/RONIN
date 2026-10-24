import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { tariffInclude, toTariffDTO } from "@/server/mappers";
import { tariffCreateSchema, toTariffData } from "@/server/services/tariffs";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/tariffs - все тарифы, включая отключённые
export const GET = handle(async (req) => {
  await requireAdmin(req);
  const tariffs = await prisma.tariffs.findMany({
    include: tariffInclude,
    orderBy: [{ is_active: "desc" }, { type: "asc" }, { duration_minutes: "asc" }],
  });
  const items = tariffs.map(toTariffDTO);
  return NextResponse.json({ tariffs: items, total: items.length });
});

// POST /api/admin/tariffs - создать тариф
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, tariffCreateSchema);
  const now = new Date();

  const tariff = await prisma.tariffs.create({
    data: {
      id: crypto.randomUUID(),
      name: input.name,
      duration_minutes: input.durationMinutes,
      price: input.price,
      type: input.type,
      ...toTariffData({ categoryId: input.categoryId ?? null }),
      is_active: input.isActive ?? true,
      created_at: now,
      updated_at: now,
    },
    include: tariffInclude,
  });

  await writeAuditLog({
    userId: admin.id,
    action: "CREATE_TARIFF",
    entityType: "Tariff",
    entityId: tariff.id,
    newData: toTariffDTO(tariff),
  });

  return NextResponse.json({ success: true, tariff: toTariffDTO(tariff) }, { status: 201 });
});
