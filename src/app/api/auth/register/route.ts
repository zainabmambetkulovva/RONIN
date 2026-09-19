import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    console.log("Registration attempt:", { name, email, phone });

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 6 символов" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          phone ? { phone: phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email или телефоном уже существует" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: "client",
        status: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("User created successfully:", user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Регистрация успешна",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    
    // Более детальные ошибки
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email или телефон уже используется" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}
