import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { sessionToken, code } = await req.json();

    console.log('Verify-2FA request:', { 
      sessionToken: sessionToken ? 'exists' : 'missing', 
      code: code ? code : 'missing'
    });

    // Validation
    if (!sessionToken || !code) {
      console.error('Missing fields:', { sessionToken: !!sessionToken, code: !!code });
      return NextResponse.json(
        { error: "Session token и код обязательны" },
        { status: 400 }
      );
    }

    // Проверить и декодировать JWT session token
    let session;
    try {
      const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production";
      session = jwt.verify(sessionToken, jwtSecret) as { userId: string; type: string };
      
      if (session.type !== "2fa_pending") {
        return NextResponse.json(
          { error: "Неверный тип сессии" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.json(
        { error: "Сессия истекла или неверна" },
        { status: 401 }
      );
    }

    // Проверить код в БД
    const verification = await prisma.telegram_verifications.findFirst({
      where: { user_id: session.userId },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Код не найден" },
        { status: 404 }
      );
    }

    // Проверить срок действия
    if (new Date() > verification.expires_at) {
      await prisma.telegram_verifications.delete({
        where: { id: verification.id },
      });
      return NextResponse.json(
        { error: "Код истек. Пожалуйста, запросите новый" },
        { status: 401 }
      );
    }

    // Проверить код
    if (verification.code !== code) {
      return NextResponse.json(
        { error: "Неверный код" },
        { status: 401 }
      );
    }

    // Получить пользователя
    const user = await prisma.users.findFirst({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user || (user.role !== "admin" && user.role !== "manager")) {
      return NextResponse.json(
        { error: "Пользователь не найден или не имеет прав" },
        { status: 403 }
      );
    }

    // Удалить использованный код
    await prisma.telegram_verifications.delete({
      where: { id: verification.id },
    });

    // Создать NextAuth session в БД
    const sessionTokenStr = require('crypto').randomUUID();
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    await prisma.sessions.create({
      data: {
        id: require('crypto').randomUUID(),
        session_token: sessionTokenStr,
        user_id: user.id,
        expires: sessionExpires,
      },
    });

    // Создать audit log
    try {
      await prisma.audit_logs.create({
        data: {
          id: require('crypto').randomUUID(),
          user_id: user.id,
          action: "ADMIN_LOGIN",
          entity_type: "Auth",
          entity_id: user.id,
          new_data: { timestamp: new Date().toISOString() },
          created_at: new Date(),
        },
      });
    } catch (auditError) {
      console.warn("Failed to create audit log:", auditError);
    }

    // Установить session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Устанавливаем session cookie для NextAuth
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieName = isProduction 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token';

    response.headers.append(
      'Set-Cookie',
      serialize(cookieName, sessionTokenStr, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        expires: sessionExpires,
      })
    );

    return response;
  } catch (error: any) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}
