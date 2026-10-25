import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { endSession, toSessionDTO } from "@/server/services/sessions";
import { writeAuditLog } from "@/server/services/audit";

// POST /api/admin/sessions/[id]/end — завершить сессию (admin, manager)
export const POST = handle<{ id: string }>(async (req, { params }) => {
  const staff = await requireStaff(req);
  const session = await endSession(params.id, staff.id);
  await writeAuditLog({ userId: staff.id, action: "SESSION_END", entityType: "GamingSession", entityId: params.id });
  return NextResponse.json({ success: true, session: toSessionDTO(session) });
});
