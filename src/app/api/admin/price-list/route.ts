import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { applyPriceList, planPriceList } from "@/server/services/price-list";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/price-list - предпросмотр: что изменится при загрузке прайса RONIN
export const GET = handle(async (req) => {
  await requireAdmin(req);
  return NextResponse.json({ plan: await planPriceList() });
});

// POST /api/admin/price-list - загрузить прайс RONIN (идемпотентно)
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const before = await planPriceList();
  const after = await applyPriceList();

  await writeAuditLog({
    userId: admin.id,
    action: "APPLY_PRICE_LIST",
    entityType: "Tariff",
    oldData: before,
  });

  return NextResponse.json({ success: true, plan: after });
});
