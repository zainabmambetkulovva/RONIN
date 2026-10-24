import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { handle } from "@/server/http";
import { tariffInclude, toTariffDTO } from "@/server/mappers";

export const dynamic = "force-dynamic";

/**
 * GET /api/tariffs - активные тарифы (единственный публичный источник цен).
 *
 * `categoryId` — тарифы, применимые к категории компьютеров
 * (тарифы этой категории и общие тарифы без категории).
 */
export const GET = handle(async (req) => {
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  const where: Prisma.tariffsWhereInput = { is_active: true };
  if (categoryId) {
    where.OR = [{ category_id: categoryId }, { category_id: null }];
  }

  const tariffs = await prisma.tariffs.findMany({
    where,
    include: tariffInclude,
    orderBy: [{ type: "asc" }, { duration_minutes: "asc" }],
  });

  const items = tariffs.map(toTariffDTO);
  return NextResponse.json({ tariffs: items, total: items.length });
});
