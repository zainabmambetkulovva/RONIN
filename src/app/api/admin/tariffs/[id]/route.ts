import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/admin/tariffs/[id] - update tariff
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, durationMinutes, price, type, categoryId } = body;

    const tariff = await prisma.tariff.update({
      where: { id: params.id },
      data: {
        name,
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        type,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, tariff });
  } catch (error) {
    console.error("Error updating tariff:", error);
    return NextResponse.json(
      { error: "Failed to update tariff" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tariffs/[id] - delete tariff
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tariff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tariff:", error);
    return NextResponse.json(
      { error: "Failed to delete tariff" },
      { status: 500 }
    );
  }
}
