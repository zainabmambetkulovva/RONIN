import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tariffs - получить тарифы по категории
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const tariffs = await prisma.tariffs.findMany({
      where: {
        category_id: categoryId,
        is_active: true,
      },
      orderBy: [
        { type: "asc" },
        { duration_minutes: "asc" },
      ],
    });

    return NextResponse.json({ tariffs, total: tariffs.length });
  } catch (error) {
    console.error("Error fetching tariffs:", error);
    return NextResponse.json(
      { error: "Failed to fetch tariffs" },
      { status: 500 }
    );
  }
}
