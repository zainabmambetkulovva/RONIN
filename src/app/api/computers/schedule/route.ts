import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, handle } from "@/server/http";
import { getStaffUser } from "@/server/auth/staff";
import { getComputerSchedule } from "@/server/services/schedule";

export const dynamic = "force-dynamic";

const query = z.object({
  from: z.string().datetime({ offset: true }).optional(),
  hours: z.coerce.number().int().min(1).max(48).default(30),
});

// GET /api/computers/schedule?from=ISO&hours=30 — занятость ПК для 3D-карты (персоналу — с именами клиентов)
export const GET = handle(async (req) => {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) throw badRequest("Некорректные параметры");
  const from = parsed.data.from ? new Date(parsed.data.from) : new Date(Date.now() - 60 * 60_000);
  const to = new Date(from.getTime() + parsed.data.hours * 60 * 60_000);
  const staff = await getStaffUser(req);
  const computers = await getComputerSchedule(from, to, !!staff);
  return NextResponse.json({ from: from.toISOString(), to: to.toISOString(), computers }, { headers: { "Cache-Control": "no-store" } });
});
