import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle } from "@/server/http";
import { categoryInclude, toCategoryDTO } from "@/server/mappers";

export const dynamic = "force-dynamic";

// GET /api/categories - активные категории компьютеров
export const GET = handle(async () => {
  const categories = await prisma.computer_categories.findMany({
    where: { is_active: true },
    include: categoryInclude,
    orderBy: { name: "asc" },
  });

  const items = categories.map(toCategoryDTO);
  return NextResponse.json({ categories: items, total: items.length });
});
