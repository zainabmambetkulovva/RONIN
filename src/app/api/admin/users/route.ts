import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users - получить всех пользователей
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const where: any = {};

    if (role && role !== "all") {
      where.role = role as UserRole;
    }

    if (status && status !== "all") {
      where.status = status as UserStatus;
    }

    const users = await prisma.users.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform snake_case to camelCase for frontend
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    return NextResponse.json({ users: transformedUsers, total: transformedUsers.length });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - создать нового пользователя
export async function POST(req: NextRequest) {
  try {
    // TODO: Get actual admin ID from session
    const adminId = "mock-user-id";

    const body = await req.json();
    const { name, email, phone, role } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (email) {
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    }

    if (phone) {
      const existingUser = await prisma.users.findUnique({
        where: { phone },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this phone already exists" },
          { status: 409 }
        );
      }
    }

    // Create user
    const user = await prisma.users.create({
      data: {
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        role: (role as UserRole) || UserRole.client,
        status: UserStatus.active,
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
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      createdAt: user.created_at,
    };

    // Try to create audit log (не блокирует создание пользователя если не получится)
    try {
      await prisma.audit_logs.create({
        data: {
          user_id: adminId,
          action: "CREATE_USER",
          entity_type: "User",
          entity_id: user.id,
          new_data: { name: user.name, email: user.email, phone: user.phone, role: user.role },
        },
      });
    } catch (auditError) {
      console.warn("Failed to create audit log:", auditError);
      // Не прерываем выполнение, просто логируем
    }

    return NextResponse.json({
      success: true,
      user: transformedUser,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    // Более детальное сообщение об ошибке
    const errorMessage = error.message || "Failed to create user";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
