import { NextResponse } from "next/server";
import { badRequest, handle } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";
import { getAdminStats } from "@/server/services/stats";
import type { StatsPeriod } from "@/server/time";

export const dynamic = "force-dynamic";

const PERIODS: StatsPeriod[] = ["today", "week", "month"];

// GET /api/admin/stats?period=today|week|month — показатели клуба (admin, manager; деньги — только admin)
export const GET = handle(async (req) => {
  const staff = await requireStaff(req);
  const period = (req.nextUrl.searchParams.get("period") ?? "today") as StatsPeriod;
  if (!PERIODS.includes(period)) throw badRequest("Некорректный период");

  const stats = await getAdminStats(period);
  if (staff.role !== "admin") {
    stats.payments = null;
    stats.revenueByDay = [];
  }
  return NextResponse.json({ stats });
});
