import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/admin/users/[id]/status - изменить статус пользователя
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Get actual admin ID from session
    const adminId = "mock-user-id";

    const body = await req.json();
    const { status } = body;

    if (!status || !["active", "blocked"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update status
    const updatedUser = await prisma.users.update({
      where: { id: params.id },
      data: {
        status: status as UserStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        created_at: true,
      },
    });

    // Transform for frontend
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.created_at,
    };

    // Audit log
    await prisma.audit_logs.create({
      data: {
        user_id: adminId,
        action: status === "blocked" ? "BLOCK_USER" : "UNBLOCK_USER",
        entity_type: "User",
        entity_id: params.id,
        old_data: { status: user.status },
        new_data: { status },
      },
    });

    // Notification
    await prisma.notifications.create({
      data: {
        user_id: params.id,
        type: status === "blocked" ? "account_blocked" : "account_activated",
        title: status === "blocked" ? "Аккаунт заблокирован" : "Аккаунт активирован",
        message:
          status === "blocked"
            ? "Ваш аккаунт был заблокирован администратором."
            : "Ваш аккаунт был активирован.",
        is_read: false,
      },
    });

    return NextResponse.json({
      success: true,
      user: transformedUser,
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
