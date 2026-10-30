import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueResetCode } from "@/server/services/password-reset";
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

    // Код (в базе — только хэш, 10 минут)
    const code = await issueResetCode(email, user.id);

    // Код выводится в консоль только при локальной разработке
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset code for ${email}: ${code}`);
    }

    // В production отправить через Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Resend не бросает исключение, а возвращает { error } — например, если домен отправителя не подтверждён
        const { error: sendError } = await resend.emails.send({
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
        if (sendError) throw new Error(sendError.message || String(sendError));
      } catch (emailError: any) {
        console.error("Failed to send email:", emailError);
        return NextResponse.json(
          { error: `Не удалось отправить письмо с кодом. Попробуйте позже или свяжитесь с клубом. (${emailError?.message ?? "ошибка почты"})` },
          { status: 502 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Отправка писем на сайте ещё не настроена. Свяжитесь с клубом." }, { status: 503 });
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
