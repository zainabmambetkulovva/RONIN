import { NextResponse } from "next/server";
import { handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { clubConfigSchema, getClubConfig, saveClubConfig } from "@/server/services/club-config";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/settings/club — соцсети и зоны зала
export const GET = handle(async (req) => {
  await requireAdmin(req);
  return NextResponse.json({ config: await getClubConfig() });
});

// PUT /api/admin/settings/club
export const PUT = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, clubConfigSchema);
  const before = await getClubConfig();
  const config = await saveClubConfig(input);
  await writeAuditLog({ userId: admin.id, action: "UPDATE_CLUB_CONFIG", entityType: "Settings", entityId: "club.config", oldData: before, newData: config });
  return NextResponse.json({ config });
});
