import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, handle } from "@/server/http";
import { computerInclude, toComputerDTO } from "@/server/mappers";
import { findBusyComputerIds } from "@/server/services/availability";
import { activeComputerWhere } from "@/server/services/computers";

export const dynamic = "force-dynamic";

/**
 * GET /api/computers - компьютеры с категориями
 *
 * Параметры:
 *  - categoryId — фильтр по категории;
 *  - start (ISO) + durationMinutes — дополнительно вычислить `availableForSlot` для интервала.
 */
export const GET = handle(async (req) => {
  const { searchParams } = req.nextUrl;
  const categoryId = searchParams.get("categoryId");
  const startParam = searchParams.get("start");
  const durationParam = searchParams.get("durationMinutes");

  const computers = await prisma.computers.findMany({
    where: { ...activeComputerWhere, ...(categoryId ? { category_id: categoryId } : {}) },
    include: computerInclude,
    orderBy: { number: "asc" },
  });

  let busy: Set<string> | null = null;
  if (startParam) {
    const start = new Date(startParam);
    const duration = Number(durationParam ?? 60);
    if (Number.isNaN(start.getTime())) throw badRequest("Некорректный параметр start");
    if (!Number.isInteger(duration) || duration <= 0 || duration > 24 * 60) {
      throw badRequest("Некорректный параметр durationMinutes");
    }
    busy = await findBusyComputerIds(start, new Date(start.getTime() + duration * 60_000));
  }

  const items = computers.map((c) =>
    toComputerDTO(c, busy ? c.status !== "maintenance" && !busy.has(c.id) : null)
  );
  return NextResponse.json({ computers: items, total: items.length });
});
