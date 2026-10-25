import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { handle, parseJson } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { sessionInclude, startSession, toSessionDTO } from "@/server/services/sessions";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/sessions?scope=active|history&computerId= — игровые сессии (admin, manager)
 */
export const GET = handle(async (req) => {
  await requireStaff(req);
  const { searchParams } = req.nextUrl;
  const scope = searchParams.get("scope") ?? "active";
  const computerId = searchParams.get("computerId");

  const where: Prisma.gaming_sessionsWhereInput = scope === "history" ? { status: { not: "active" } } : { status: "active" };
  if (computerId) where.computer_id = computerId;

  const sessions = await prisma.gaming_sessions.findMany({
    where,
    include: sessionInclude,
    orderBy: { started_at: "desc" },
    take: scope === "history" ? 200 : 500,
  });
  return NextResponse.json({ sessions: sessions.map(toSessionDTO), total: sessions.length });
});

const startSchema = z.object({ bookingId: z.string().min(1, "Укажите бронь") });

// POST /api/admin/sessions — начать сессию по оплаченной брони (admin, manager)
export const POST = handle(async (req) => {
  const staff = await requireStaff(req);
  const { bookingId } = await parseJson(req, startSchema);
  const session = await startSession(bookingId, staff.id);
  await writeAuditLog({ userId: staff.id, action: "SESSION_START", entityType: "GamingSession", entityId: session.id, newData: { bookingId } });
  return NextResponse.json({ success: true, session: toSessionDTO(session) }, { status: 201 });
});
