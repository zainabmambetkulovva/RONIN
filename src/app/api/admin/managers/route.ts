import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";



// GET /api/admin/managers - получить всех менеджеров
export async function GET(req: NextRequest) {
  try {
    const managers = await prisma.users.findMany({
      where: {
        role: UserRole.manager,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform for frontend
    const transformedManagers = managers.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      status: m.status,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));

    return NextResponse.json({ managers: transformedManagers, total: transformedManagers.length });
  } catch (error) {
    console.error("Error fetching managers:", error);
    return NextResponse.json(
      { error: "Failed to fetch managers" },
      { status: 500 }
    );
  }
}

// POST /api/admin/managers - создать менеджера
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Проверка уникальности
    const existing = await prisma.users.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this phone or email already exists" },
        { status: 409 }
      );
    }

    const manager = await prisma.users.create({
      data: {
        name,
        phone,
        email,
        password, // TODO: hash password
        role: UserRole.manager,
        status: UserStatus.active,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
    });

    // Transform for frontend
    const transformedManager = {
      id: manager.id,
      name: manager.name,
      phone: manager.phone,
      email: manager.email,
      role: manager.role,
      status: manager.status,
      createdAt: manager.created_at,
    };

    return NextResponse.json({ manager: transformedManager }, { status: 201 });
  } catch (error) {
    console.error("Error creating manager:", error);
    return NextResponse.json(
      { error: "Failed to create manager" },
      { status: 500 }
    );
  }
}
