import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      );
    }

    // Найти пользователя
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // Всегда возвращаем успех (security best practice - не раскрываем существование email)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Если email существует, мы отправили ссылку для сброса',
      });
    }

    // Генерировать токен
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код

    // Удалить старые токены
    await prisma.password_reset_tokens.deleteMany({
      where: { user_id: user.id },
    });

    // Создать новый токен
    await prisma.password_reset_tokens.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
        created_at: new Date(),
      },
    });

    // Отправить email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@ronin.kg',
        to: email,
        subject: 'RONIN - Восстановление пароля',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">RONIN Gaming Club</h1>
            <h2>Восстановление пароля</h2>
            <p>Вы запросили сброс пароля для вашего аккаунта.</p>
            <p>Ваш код для сброса пароля:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${token}
            </div>
            <p>Этот код действителен в течение 15 минут.</p>
            <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              С уважением,<br>
              Команда RONIN Gaming Club<br>
              <a href="https://ronin.kg" style="color: #9333ea;">ronin.kg</a>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Не возвращаем ошибку пользователю
    }

    return NextResponse.json({
      success: true,
      message: 'Если email существует, мы отправили ссылку для сброса',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
