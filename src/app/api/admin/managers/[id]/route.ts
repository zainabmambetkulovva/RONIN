import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/managers/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!manager) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    return NextResponse.json({ manager });
  } catch (error) {
    console.error("Error fetching manager:", error);
    return NextResponse.json(
      { error: "Failed to fetch manager" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/managers/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting manager:", error);
    return NextResponse.json(
      { error: "Failed to delete manager" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/managers/[id] - обновить статус
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, name, phone, email } = body;

    const manager = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ manager });
  } catch (error) {
    console.error("Error updating manager:", error);
    return NextResponse.json(
      { error: "Failed to update manager" },
      { status: 500 }
    );
  }
}
