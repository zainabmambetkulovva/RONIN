/**
 * Подпись и проверка JWT. Без обращений к БД и Node-модулям — безопасно для middleware.
 */
import { SignJWT, jwtVerify } from "jose";
import {
  getAuthSecret,
  STAFF_SESSION_TTL_SECONDS,
  TWO_FACTOR_TTL_SECONDS,
  USER_SESSION_TTL_SECONDS,
} from "@/server/config";

export type UserRoleName = "client" | "manager" | "admin";
export type StaffRoleName = "admin" | "manager";

/** Формат совпадает с уже выданными токенами (`/api/auth/login`, Google callback). */
export interface UserTokenPayload {
  id: string;
  email: string | null;
  role: UserRoleName;
  needsSetup: boolean;
}

export interface StaffTokenPayload {
  userId: string;
  email: string | null;
  role: StaffRoleName;
  type: "admin_session";
}

interface TwoFactorTokenPayload {
  userId: string;
  type: "2fa_pending";
}

async function sign(payload: Record<string, unknown>, ttlSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(getAuthSecret());
}

async function verify(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), { algorithms: ["HS256"] });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function signUserToken(payload: UserTokenPayload) {
  return sign({ ...payload }, USER_SESSION_TTL_SECONDS);
}

export async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  const payload = await verify(token);
  // Токены персонала и 2FA имеют другой формат и здесь не принимаются
  if (!payload || typeof payload.id !== "string" || payload.type !== undefined) return null;
  return payload as unknown as UserTokenPayload;
}

export function signStaffToken(payload: Omit<StaffTokenPayload, "type">) {
  return sign({ ...payload, type: "admin_session" }, STAFF_SESSION_TTL_SECONDS);
}

export async function verifyStaffToken(token: string): Promise<StaffTokenPayload | null> {
  const payload = await verify(token);
  if (!payload || payload.type !== "admin_session" || typeof payload.userId !== "string") return null;
  if (payload.role !== "admin" && payload.role !== "manager") return null;
  return payload as unknown as StaffTokenPayload;
}

export function signTwoFactorToken(userId: string) {
  return sign({ userId, type: "2fa_pending" }, TWO_FACTOR_TTL_SECONDS);
}

export async function verifyTwoFactorToken(token: string): Promise<TwoFactorTokenPayload | null> {
  const payload = await verify(token);
  if (!payload || payload.type !== "2fa_pending" || typeof payload.userId !== "string") return null;
  return payload as unknown as TwoFactorTokenPayload;
}
