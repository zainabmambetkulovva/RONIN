import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/user/avatar - обновить аватар пользователя
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { avatarCode } = body;

    if (!avatarCode) {
      return NextResponse.json(
        { error: "Avatar code is required" },
        { status: 400 }
      );
    }

    // Verify avatar exists
    const avatar = await prisma.avatars.findFirst({
      where: { 
        code: avatarCode,
        is_active: true
      },
    });

    if (!avatar) {
      return NextResponse.json(
        { error: "Invalid avatar code" },
        { status: 400 }
      );
    }

    // Update user avatar
    const updatedUser = await prisma.users.update({
      where: { id: session.user.id },
      data: { avatar: avatarCode },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
