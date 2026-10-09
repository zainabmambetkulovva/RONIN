import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// GET /api/computers - получить все компьютеры с категориями
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    if (categoryId) {
      where.category_id = categoryId;
    }

    const computers = await prisma.computers.findMany({
      where,
      include: {
        computer_categories: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    // Преобразуем в camelCase для фронтенда
    const formattedComputers = computers.map(comp => ({
      id: comp.id,
      number: comp.number,
      categoryId: comp.category_id,
      category: {
        id: comp.computer_categories.id,
        name: comp.computer_categories.name,
        description: comp.computer_categories.description,
      },
      specifications: comp.specifications,
      status: comp.status,
    }));

    return NextResponse.json({ computers: formattedComputers, total: formattedComputers.length });
  } catch (error: any) {
    console.error("Error fetching computers:", error);
    return NextResponse.json(
      { error: "Failed to fetch computers", details: error.message },
      { status: 500 }
    );
  }
}
