import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { send2FACode } from "@/lib/telegram";
import { checkRateLimit, rateLimitError } from "@/lib/rate-limiter";
import { ApiError, forbidden, handle, parseJson, unauthorized } from "@/server/http";
import { signTwoFactorToken } from "@/server/auth/tokens";
import { generateTwoFactorCode, hashTwoFactorCode } from "@/server/auth/two-factor";
import { TWO_FACTOR_TTL_SECONDS } from "@/server/config";

const schema = z.object({
  email: z.string().trim().min(1, "Email и пароль обязательны"),
  password: z.string().min(1, "Email и пароль обязательны"),
});

/**
 * POST /api/admin/auth/send-2fa
 * Шаг 1 входа персонала: проверка пароля и отправка одноразового кода в Telegram.
 */
export const POST = handle(async (req) => {
  const rateLimit = await checkRateLimit(req, "admin-send-2fa", 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    throw new ApiError(429, rateLimitError(rateLimit.remaining, rateLimit.resetAt).error, "rate_limited");
  }

  const { email, password } = await parseJson(req, schema);

  const user = await prisma.users.findFirst({ where: { email } });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw unauthorized("Неверный email или пароль");
  }
  if (user.status !== "active") throw forbidden("Аккаунт заблокирован");
  if (user.role !== "admin" && user.role !== "manager") throw forbidden("Доступ запрещен");

  const isProduction = process.env.NODE_ENV === "production";
  if (!user.telegram_chat_id && isProduction) {
    throw forbidden("Telegram не подключён к аккаунту. Обратитесь к администратору для настройки 2FA.");
  }

  const code = generateTwoFactorCode();
  const now = new Date();

  await prisma.$transaction([
    prisma.telegram_verifications.deleteMany({ where: { user_id: user.id } }),
    prisma.telegram_verifications.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        code: hashTwoFactorCode(code),
        expires_at: new Date(now.getTime() + TWO_FACTOR_TTL_SECONDS * 1000),
        created_at: now,
      },
    }),
  ]);

  const sent = user.telegram_chat_id ? await send2FACode(user.telegram_chat_id, code) : false;

  if (!sent) {
    if (isProduction) {
      throw new ApiError(503, "Не удалось отправить код в Telegram. Попробуйте позже.", "telegram_unavailable");
    }
    // Только для локальной разработки: код в консоли сервера
    console.log(`[DEV] 2FA code for ${user.email}: ${code}`);
  }

  return NextResponse.json({
    success: true,
    sessionToken: await signTwoFactorToken(user.id),
    message: sent ? "Код отправлен в Telegram" : "Код создан (DEV: см. консоль сервера)",
    role: user.role,
  });
});
