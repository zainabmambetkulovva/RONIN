import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// GET /api/categories - получить все категории компьютеров
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.computer_categories.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            computers: true,
            tariffs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ categories, total: categories.length });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}
