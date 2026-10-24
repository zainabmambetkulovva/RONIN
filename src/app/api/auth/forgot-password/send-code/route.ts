import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { checkRateLimit, rateLimitError } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(req, "forgot-password-send-code", 3, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimitError(rateLimit.remaining, rateLimit.resetAt).error },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    // Проверить существует ли пользователь
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь с таким email не найден" },
        { status: 404 }
      );
    }

    // Генерировать 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Хэшировать код для безопасного хранения
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    // Удалить старые коды для этого email
    await prisma.password_reset_codes.deleteMany({
      where: { email },
    });

    // Сохранить хэш кода (действителен 10 минут)
    await prisma.password_reset_codes.create({
      data: {
        id: crypto.randomUUID(),
        email,
        code: codeHash,
        expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
        created_at: new Date(),
      },
    });

    // Код выводится в консоль только при локальной разработке
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset code for ${email}: ${code}`);
    }

    // В production отправить через Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@ronin.kg",
          to: email,
          subject: "Код для сброса пароля - RONIN",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #8b5cf6;">Сброс пароля</h2>
              <p>Ваш код для сброса пароля:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                ${code}
              </div>
              <p>Код действителен 10 минут.</p>
              <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">RONIN Gaming Club<br>Бишкек, Кыргызстан</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Код отправлен на email",
    });
  } catch (error: any) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка отправки кода" },
      { status: 500 }
    );
  }
}
