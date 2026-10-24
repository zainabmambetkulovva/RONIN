/**
 * Пользовательская сессия (клиенты): httpOnly cookie `session-token`.
 * Единственное место, где API читает «кто сейчас вошёл».
 */
import { cookies } from "next/headers";
import type { users } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, USER_SESSION_TTL_SECONDS } from "@/server/config";
import { signUserToken, verifyUserToken } from "@/server/auth/tokens";
import { unauthorized } from "@/server/http";

export async function createUserSession(user: users) {
  const token = await signUserToken({
    id: user.id,
    email: user.email,
    role: user.role,
    needsSetup: !user.name || !user.avatar,
  });

  cookies().set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: USER_SESSION_TTL_SECONDS,
    path: "/",
  });
}

export function clearUserSession() {
  cookies().delete(USER_SESSION_COOKIE);
}

/** Текущий пользователь из БД или null. Заблокированные и удалённые считаются невошедшими. */
export async function getSessionUser(): Promise<users | null> {
  const token = cookies().get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyUserToken(token);
  if (!payload) return null;

  const user = await prisma.users.findUnique({ where: { id: payload.id } });
  if (!user || user.status !== "active") return null;
  return user;
}

export async function requireUser(): Promise<users> {
  const user = await getSessionUser();
  if (!user) throw unauthorized();
  return user;
}
