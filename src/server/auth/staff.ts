/**
 * Сессия персонала (admin / manager).
 *
 * Токен выдаётся только после пароля + Telegram-кода (`/api/admin/auth/verify-2fa`)
 * и хранится в httpOnly cookie `admin-token`. Для совместимости принимается также
 * заголовок `Authorization: Bearer <token>`.
 *
 * Роль всегда берётся из БД, а не из токена: смена роли или блокировка действуют сразу.
 */
import { cookies } from "next/headers";
import type { users } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { STAFF_SESSION_COOKIE, STAFF_SESSION_TTL_SECONDS } from "@/server/config";
import { signStaffToken, verifyStaffToken, type StaffRoleName } from "@/server/auth/tokens";
import { forbidden, unauthorized } from "@/server/http";

export type StaffUser = users & { role: StaffRoleName };

export async function createStaffSession(user: StaffUser): Promise<string> {
  const token = await signStaffToken({ userId: user.id, email: user.email, role: user.role });

  cookies().set(STAFF_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: STAFF_SESSION_TTL_SECONDS,
    path: "/",
  });

  return token;
}

export function clearStaffSession() {
  cookies().delete(STAFF_SESSION_COOKIE);
}

function readStaffToken(req?: Request): string | null {
  const fromCookie = cookies().get(STAFF_SESSION_COOKIE)?.value;
  if (fromCookie) return fromCookie;

  const authHeader = req?.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.substring(7);
  return null;
}

export async function getStaffUser(req?: Request): Promise<StaffUser | null> {
  const token = readStaffToken(req);
  if (!token) return null;

  const payload = await verifyStaffToken(token);
  if (!payload) return null;

  const user = await prisma.users.findUnique({ where: { id: payload.userId } });
  if (!user || user.status !== "active") return null;
  if (user.role !== "admin" && user.role !== "manager") return null;
  return user as StaffUser;
}

/** Персонал с одной из указанных ролей, иначе 401/403. По умолчанию — admin и manager. */
export async function requireStaff(
  req?: Request,
  roles: StaffRoleName[] = ["admin", "manager"]
): Promise<StaffUser> {
  const user = await getStaffUser(req);
  if (!user) throw unauthorized("Требуется вход в панель управления");
  if (!roles.includes(user.role)) throw forbidden();
  return user;
}

export function requireAdmin(req?: Request) {
  return requireStaff(req, ["admin"]);
}
