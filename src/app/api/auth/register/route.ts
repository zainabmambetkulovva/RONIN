import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendNewUserNotification } from "@/lib/telegram";
import { checkRateLimit, rateLimitError } from "@/lib/rate-limiter";
import { createUserSession } from "@/server/auth/session";
import { KG_PHONE_ERROR, normalizeKgPhone } from "@/lib/phone";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(req, "register", 3, 60 * 60 * 1000); // 3 попытки в час
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimitError(rateLimit.remaining, rateLimit.resetAt).error },
        { status: 429 }
      );
    }

    const { name, email, password, phone: rawPhone } = await req.json();
    // Телефон — только кыргызский номер, в базе в виде +996XXXXXXXXX
    const phone = rawPhone ? normalizeKgPhone(String(rawPhone)) : null;
    if (rawPhone && !phone) {
      return NextResponse.json({ error: KG_PHONE_ERROR }, { status: 400 });
    }

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
    const created = await prisma.users.create({
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
    });

    // Сразу входим: после регистрации клиент попадает в личный кабинет, без повторного ввода пароля
    await createUserSession(created);
    const user = {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      role: created.role,
      created_at: created.created_at,
    };

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
