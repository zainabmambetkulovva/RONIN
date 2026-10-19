import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Пользователь не найден или не является администратором" },
        { status: 403 }
      );
    }

    // Удалить использованный код
    await prisma.telegram_verifications.delete({
      where: { id: verification.id },
    });

    // Создать JWT token
    const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "admin",
      },
      jwtSecret,
      { expiresIn: "7d" } // Токен действителен 7 дней
    );

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

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}
