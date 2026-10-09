import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE /api/admin/users/[id] - удалить пользователя
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Get actual admin ID from session
    const adminId = "mock-user-id";

    // Prevent deleting self
    if (params.id === adminId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Get user before deletion for audit log
    const user = await prisma.users.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Soft delete - change status instead of actual deletion
    await prisma.users.update({
      where: { id: params.id },
      data: {
        status: "deleted",
      },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        user_id: adminId,
        action: "DELETE_USER",
        entity_type: "User",
        entity_id: params.id,
        old_data: { name: user.name, email: user.email, role: user.role },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
