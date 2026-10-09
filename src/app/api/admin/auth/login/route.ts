import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Хранилище временных сессий (в production использовать Redis)
const tempSessions = new Map<string, { userId: string; timestamp: number }>();

// Очистка старых сессий (>5 минут)
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of tempSessions.entries()) {
    if (now - session.timestamp > 5 * 60 * 1000) {
      tempSessions.delete(token);
    }
  }
}, 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // Найти пользователя с ролью admin
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: "admin",
        status: "active",
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Получить Telegram настройки из таблицы settings
    const botTokenSetting = await prisma.setting.findUnique({
      where: { key: "ADMIN_TELEGRAM_BOT_TOKEN" },
    });

    const adminTelegramIdSetting = await prisma.setting.findUnique({
      where: { key: "ADMIN_TELEGRAM_USER_ID" },
    });

    if (!botTokenSetting || !adminTelegramIdSetting) {
      return NextResponse.json(
        { error: "Telegram настройки не найдены в системе" },
        { status: 500 }
      );
    }

    const botToken = botTokenSetting.value;
    const telegramId = user.telegramId || adminTelegramIdSetting.value;

    if (!telegramId) {
      return NextResponse.json(
        { error: "Telegram ID не привязан к аккаунту" },
        { status: 400 }
      );
    }

    // Генерация 6-значного кода
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Сохранить код в БД
    await prisma.telegramVerification.upsert({
      where: { userId: user.id },
      update: {
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 минут
      },
      create: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Отправить код через Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const message = `🔐 *RONIN Admin Access*\n\nВаш код для входа:\n\n\`${code}\`\n\nКод действителен 5 минут.\n\n_Если вы не запрашивали этот код, проигнорируйте это сообщение._`;

    try {
      const telegramRes = await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!telegramRes.ok) {
        const errorData = await telegramRes.json();
        console.error("Telegram API error:", errorData);
        throw new Error("Не удалось отправить код в Telegram");
      }
    } catch (telegramError: any) {
      console.error("Failed to send Telegram message:", telegramError);
      return NextResponse.json(
        { error: "Ошибка отправки кода в Telegram" },
        { status: 500 }
      );
    }

    // Создать временный session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    tempSessions.set(sessionToken, {
      userId: user.id,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      message: "Код отправлен в Telegram",
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export { tempSessions };
