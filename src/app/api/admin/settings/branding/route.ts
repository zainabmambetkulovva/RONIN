import { NextResponse } from "next/server";
import { handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { brandingUpdateSchema, getBranding, updateBranding } from "@/server/services/branding";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/settings/branding
export const GET = handle(async (req) => {
  await requireAdmin(req);
  return NextResponse.json({ branding: await getBranding() });
});

// PUT /api/admin/settings/branding — только администратор
export const PUT = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, brandingUpdateSchema);
  const before = await getBranding();
  const branding = await updateBranding(input);
  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_BRANDING",
    entityType: "Settings",
    entityId: "branding",
    oldData: { clubName: before.clubName, gradient: before.gradient },
    newData: {
      clubName: branding.clubName,
      gradient: branding.gradient,
      logo: input.logo === undefined ? "unchanged" : input.logo === null ? "reset" : "uploaded",
      hero: input.hero === undefined ? "unchanged" : input.hero === null ? "reset" : "uploaded",
    },
  });
  return NextResponse.json({ branding });
});
