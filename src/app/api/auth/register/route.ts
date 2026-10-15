import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendNewUserNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    // Валидация
    if (!name || !password) {
      return NextResponse.json(
        { error: "Имя и пароль обязательны" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email или телефон обязательны" },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    if (email) {
      const existingUser = await prisma.users.findFirst({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Пользователь с таким email уже существует" },
          { status: 409 }
        );
      }
    }

    if (phone) {
      const existingUser = await prisma.users.findFirst({
        where: { phone },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Пользователь с таким телефоном уже существует" },
          { status: 409 }
        );
      }
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        role: "client",
        status: "active",
        avatar: "default",
        created_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    // Отправить уведомление в Telegram (не блокируем ответ если ошибка)
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      sendNewUserNotification(adminChatId, {
        name: user.name,
        email: user.email || undefined,
        phone: user.phone || undefined,
      }).catch((error) => {
        console.error("Failed to send Telegram notification:", error);
      });
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Регистрация успешна",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка регистрации", details: error.message },
      { status: 500 }
    );
  }
}
