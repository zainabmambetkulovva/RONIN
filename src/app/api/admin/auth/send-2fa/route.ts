import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { send2FACode } from "@/lib/telegram";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * POST /api/admin/auth/send-2fa
 * Отправить 2FA код админу в Telegram после успешного ввода логина/пароля
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // Найти пользователя
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Проверить что это админ или менеджер
    if (user.role !== "admin" && user.role !== "manager") {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      );
    }

    // ВРЕМЕННО: 2FA өчүрүлгөн, туура Chat ID алгандан кийин кошобуз
    // Проверить что у пользователя есть Telegram Chat ID
    // if (!user.telegram_chat_id) {
    //   return NextResponse.json(
    //     { error: "Telegram не подключен. Обратитесь к администратору для настройки 2FA." },
    //     { status: 400 }
    //   );
    // }

    // Генерировать 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Удалить старый код если есть
    await prisma.telegram_verifications.deleteMany({
      where: { user_id: user.id },
    });

    // Сохранить код в БД (действителен 5 минут)
    await prisma.telegram_verifications.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        code,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 минут
        created_at: new Date(),
      },
    });

    // Отправить код в Telegram
    console.log(`\n🔐 2FA КОД: ${code} для ${user.email}\n`);
    
    const sent = await send2FACode(user.telegram_chat_id, code);

    if (!sent) {
      console.error('❌ Не удалось отправить в Telegram, но код создан');
      // Продолжаем работу, код в консоли
    }

    // Создать временный JWT session token (действителен 5 минут)
    const jwt = require('jsonwebtoken');
    const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production";
    const sessionToken = jwt.sign(
      {
        userId: user.id,
        type: "2fa_pending",
      },
      jwtSecret,
      { expiresIn: "5m" }
    );

    return NextResponse.json({
      success: true,
      sessionToken,
      message: sent ? "Код отправлен в Telegram" : "Код создан (см. консоль)",
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("Send 2FA error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
