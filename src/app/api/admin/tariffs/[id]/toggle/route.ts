import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/admin/tariffs/[id]/toggle - toggle active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tariff = await prisma.tariff.findUnique({
      where: { id: params.id },
    });

    if (!tariff) {
      return NextResponse.json(
        { error: "Tariff not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.tariff.update({
      where: { id: params.id },
      data: {
        isActive: !tariff.isActive,
      },
    });

    return NextResponse.json({ success: true, tariff: updated });
  } catch (error) {
    console.error("Error toggling tariff:", error);
    return NextResponse.json(
      { error: "Failed to toggle tariff status" },
      { status: 500 }
    );
  }
}
