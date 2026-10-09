import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// PATCH /api/user/avatar - обновить аватар пользователя
export async function PATCH(req: NextRequest) {
  try {
    // TODO: Replace with real auth when NextAuth is configured
    // const session = await getServerSession();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // For now, use mock user ID (replace this with real auth)
    const mockUserId = "mock-user-id"; // This should come from session

    const body = await req.json();
    const { avatarCode } = body;

    if (!avatarCode) {
      return NextResponse.json(
        { error: "Avatar code is required" },
        { status: 400 }
      );
    }

    // Verify avatar exists
    const avatar = await prisma.avatar.findUnique({
      where: { code: avatarCode },
    });

    if (!avatar || !avatar.isActive) {
      return NextResponse.json(
        { error: "Invalid avatar code" },
        { status: 400 }
      );
    }

    // Update user avatar
    const updatedUser = await prisma.user.update({
      where: { id: mockUserId },
      data: { avatar: avatarCode },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
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
