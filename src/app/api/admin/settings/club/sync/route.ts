import { NextResponse } from "next/server";
import { z } from "zod";
import { handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { syncComputers } from "@/server/services/club-config";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET — сверка схемы зала с базой; POST {create:true} — создать недостающие ПК (существующие не трогаются)
export const GET = handle(async (req) => {
  await requireAdmin(req);
  return NextResponse.json(await syncComputers(false));
});

export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  await parseJson(req, z.object({ create: z.literal(true) }));
  const result = await syncComputers(true);
  if (result.created) await writeAuditLog({ userId: admin.id, action: "SYNC_COMPUTERS", entityType: "Computer", newData: { created: result.created } });
  return NextResponse.json(result);
});
