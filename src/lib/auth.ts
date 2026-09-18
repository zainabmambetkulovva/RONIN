import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ronin-super-secret-key-change-in-production"
);

const COOKIE_NAME = "ronin_session";
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const jwt = await new SignJWT({ sub: userId, tokenHash })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  return jwt;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const tokenHash = payload.tokenHash as string;
    const userId = payload.sub as string;

    const session = await prisma.session.findFirst({
      where: {
        userId,
        tokenHash,
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true, role: true, status: true },
        },
      },
    });

    if (!session || session.user.status !== "active") return null;

    return {
      id: session.user.id,
      name: session.user.name,
      phone: session.user.phone,
      role: session.user.role,
    };
  } catch {
    return null;
  }
}

export async function revokeSession(): Promise<void> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const tokenHash = payload.tokenHash as string;

    await prisma.session.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  } catch {
    // ignore
  }
}

export function setSessionCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export function clearSessionCookie(): void {
  cookies().delete(COOKIE_NAME);
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function hashOtp(otp: string): string {
  return bcrypt.hashSync(otp, 10);
}

export function verifyOtp(otp: string, hash: string): boolean {
  return bcrypt.compareSync(otp, hash);
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
