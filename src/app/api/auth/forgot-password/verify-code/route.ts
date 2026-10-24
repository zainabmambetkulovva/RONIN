import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email и код обязательны" },
        { status: 400 }
      );
    }

    // Хэшируем код для сравнения
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    // Найти код
    const resetCode = await prisma.password_reset_codes.findFirst({
      where: { email },
    });

    if (!resetCode) {
      return NextResponse.json(
        { error: "Неверный код" },
        { status: 401 }
      );
    }

    // Проверить срок действия
    if (new Date() > resetCode.expires_at) {
      await prisma.password_reset_codes.delete({
        where: { id: resetCode.id },
      });
      return NextResponse.json(
        { error: "Код истек. Запросите новый код" },
        { status: 401 }
      );
    }

    // Сравнение кодов (хэш с сохранённым значением)
    if (resetCode.code !== codeHash) {
      return NextResponse.json(
        { error: "Неверный код" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Код подтвержден",
    });
  } catch (error: any) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка проверки кода" },
      { status: 500 }
    );
  }
}
