import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAdminProtection } from "@/lib/with-admin-protection";

const prisma = new PrismaClient();

// PATCH /api/admin/tariffs/[id] - update tariff
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Protect admin endpoint
  const adminCheck = await withAdminProtection(req);
  if (adminCheck.error) return adminCheck.response;

  try {
    const body = await req.json();
    const { name, durationMinutes, price, type, categoryId } = body;

    const tariff = await prisma.tariffs.update({
      where: { id: params.id },
      data: {
        name,
        duration_minutes: parseInt(durationMinutes),
        price: parseFloat(price),
        type,
        category_id: categoryId || null,
      },
      include: {
        computer_categories: true,
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
  // Protect admin endpoint
  const adminCheck = await withAdminProtection(req);
  if (adminCheck.error) return adminCheck.response;

  try {
    await prisma.tariffs.delete({
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
