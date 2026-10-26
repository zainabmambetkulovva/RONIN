import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Коды восстановления пароля. Хранятся в существующей таблице otp_codes (есть во всех базах с первой миграции):
 * destination = "reset:<email>", в базе — только SHA-256 кода, 10 минут, не больше 5 попыток.
 */
const TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

const dest = (email: string) => `reset:${email.trim().toLowerCase()}`;
const hash = (code: string) => crypto.createHash("sha256").update(code.trim()).digest("hex");

export async function issueResetCode(email: string, userId: string): Promise<string> {
  const code = crypto.randomInt(100000, 1000000).toString();
  await prisma.$transaction([
    prisma.otp_codes.deleteMany({ where: { destination: dest(email) } }),
    prisma.otp_codes.create({
      data: { id: crypto.randomUUID(), user_id: userId, destination: dest(email), code_hash: hash(code), type: "login", expires_at: new Date(Date.now() + TTL_MS) },
    }),
  ]);
  return code;
}

export type ResetCheck = { ok: true; id: string } | { ok: false; reason: "invalid" | "expired" | "attempts" };

/** Проверка кода; неверная попытка увеличивает счётчик. consume — удалить код после успешной смены пароля. */
export async function checkResetCode(email: string, code: string): Promise<ResetCheck> {
  const row = await prisma.otp_codes.findFirst({ where: { destination: dest(email), used_at: null }, orderBy: { created_at: "desc" } });
  if (!row) return { ok: false, reason: "invalid" };
  if (row.expires_at < new Date()) {
    await prisma.otp_codes.delete({ where: { id: row.id } });
    return { ok: false, reason: "expired" };
  }
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "attempts" };
  const a = Buffer.from(row.code_hash);
  const b = Buffer.from(hash(code));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    await prisma.otp_codes.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, id: row.id };
}

export async function consumeResetCode(id: string) {
  await prisma.otp_codes.deleteMany({ where: { id } });
}

export const RESET_ERRORS: Record<"invalid" | "expired" | "attempts", string> = {
  invalid: "Неверный код",
  expired: "Код истёк. Запросите новый код",
  attempts: "Слишком много попыток. Запросите новый код",
};
