import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/user/profile - получить профиль текущего пользователя
export async function GET(req: NextRequest) {
  try {
    // TODO: Replace with real auth when NextAuth is configured
    const mockUserId = "mock-user-id";

    const user = await prisma.user.findUnique({
      where: { id: mockUserId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile - обновить профиль (кроме email)
export async function PATCH(req: NextRequest) {
  try {
    // TODO: Replace with real auth when NextAuth is configured
    const mockUserId = "mock-user-id";

    const body = await req.json();
    const { name, phone, avatar } = body;

    // Validation
    if (name && typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name format" },
        { status: 400 }
      );
    }

    if (phone && typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    if (avatar && typeof avatar !== "string") {
      return NextResponse.json(
        { error: "Invalid avatar format" },
        { status: 400 }
      );
    }

    // Build update data (excluding email)
    const updateData: any = {};
    
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    
    if (phone !== undefined) {
      updateData.phone = phone.trim() || null;
    }
    
    if (avatar !== undefined) {
      updateData.avatar = avatar || null;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: mockUserId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: "Profile updated successfully" 
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
