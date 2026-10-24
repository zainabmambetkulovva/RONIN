import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import { ApiError, forbidden, handle, parseJson, unauthorized } from "@/server/http";
import { verifyTwoFactorToken } from "@/server/auth/tokens";
import { hashTwoFactorCode } from "@/server/auth/two-factor";
import { createStaffSession, type StaffUser } from "@/server/auth/staff";
import { writeAuditLog } from "@/server/services/audit";
import { TWO_FACTOR_MAX_ATTEMPTS, TWO_FACTOR_TTL_SECONDS } from "@/server/config";

const schema = z.object({
  sessionToken: z.string().min(1, "Session token и код обязательны"),
  code: z.string().trim().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});

/**
 * POST /api/admin/auth/verify-2fa
 * Шаг 2 входа персонала: проверка Telegram-кода, выдача сессии в httpOnly cookie `admin-token`.
 */
export const POST = handle(async (req) => {
  const { sessionToken, code } = await parseJson(req, schema);

  const pending = await verifyTwoFactorToken(sessionToken);
  if (!pending) throw unauthorized("Сессия истекла или неверна");

  // Ограничение попыток ввода кода: после превышения код аннулируется
  const attempts = await checkRateLimit(
    req,
    `admin-verify-2fa:${pending.userId}`,
    TWO_FACTOR_MAX_ATTEMPTS,
    TWO_FACTOR_TTL_SECONDS * 1000
  );
  if (!attempts.allowed) {
    await prisma.telegram_verifications.deleteMany({ where: { user_id: pending.userId } });
    throw new ApiError(429, "Слишком много попыток. Запросите новый код", "rate_limited");
  }

  const verification = await prisma.telegram_verifications.findFirst({ where: { user_id: pending.userId } });
  if (!verification) throw unauthorized("Код не найден. Запросите новый");

  if (new Date() > verification.expires_at) {
    await prisma.telegram_verifications.delete({ where: { id: verification.id } });
    throw unauthorized("Код истек. Пожалуйста, запросите новый");
  }

  const expected = Buffer.from(verification.code);
  const actual = Buffer.from(hashTwoFactorCode(code));
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw unauthorized("Неверный код");
  }

  const user = await prisma.users.findUnique({ where: { id: pending.userId } });
  if (!user || user.status !== "active" || (user.role !== "admin" && user.role !== "manager")) {
    throw forbidden("Пользователь не найден или не имеет прав");
  }

  await prisma.telegram_verifications.delete({ where: { id: verification.id } });

  await createStaffSession(user as StaffUser);

  await writeAuditLog({
    userId: user.id,
    action: "ADMIN_LOGIN",
    entityType: "Auth",
    entityId: user.id,
    newData: { timestamp: new Date().toISOString() },
  });

  // Токен не возвращается в теле ответа: сессия живёт только в httpOnly cookie
  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});
