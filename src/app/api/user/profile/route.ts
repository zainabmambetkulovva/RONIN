import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/profile - получить профиль текущего пользователя
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }
    });
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
    const updatedUser = await prisma.users.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({ 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
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
