import { NextRequest, NextResponse } from "next/server";
import { TariffType } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// POST /api/admin/tariffs - create new tariff
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, durationMinutes, price, type, categoryId } = body;

    if (!name || !durationMinutes || !price || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tariff = await prisma.tariffs.create({
      data: {
        name,
        duration_minutes: parseInt(durationMinutes),
        price: parseFloat(price),
        type: type as TariffType,
        category_id: categoryId || null,
        is_active: true,
      },
      include: {
        computer_categories: true,
      },
    });

    // Transform for frontend
    const transformedTariff = {
      id: tariff.id,
      name: tariff.name,
      durationMinutes: tariff.duration_minutes,
      price: Number(tariff.price),
      type: tariff.type,
      categoryId: tariff.category_id,
      isActive: tariff.is_active,
      category: tariff.computer_categories ? {
        id: tariff.computer_categories.id,
        name: tariff.computer_categories.name,
      } : null,
    };

    return NextResponse.json({ success: true, tariff: transformedTariff });
  } catch (error) {
    console.error("Error creating tariff:", error);
    return NextResponse.json(
      { error: "Failed to create tariff" },
      { status: 500 }
    );
  }
}
