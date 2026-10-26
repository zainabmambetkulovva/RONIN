import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RESET_ERRORS, checkResetCode, consumeResetCode } from "@/server/services/password-reset";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, код и новый пароль обязательны" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 6 символов" },
        { status: 400 }
      );
    }

    // Проверить код ещё раз (хэш, срок, попытки)
    const check = await checkResetCode(String(email), String(code));
    if (!check.ok) {
      return NextResponse.json({ error: RESET_ERRORS[check.reason] }, { status: 401 });
    }

    // Найти пользователя
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Хешировать новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновить пароль
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });

    // Удалить использованный код
    await consumeResetCode(check.id);

    return NextResponse.json({
      success: true,
      message: "Пароль успешно сброшен",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сброса пароля" },
      { status: 500 }
    );
  }
}
