import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUserSession } from "@/server/auth/session";
import { checkRateLimit, createRateLimitHeaders, rateLimitError } from "@/lib/rate-limiter";

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/login - Login with email/password
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(req, "login", 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimitError(rateLimit.remaining, rateLimit.resetAt).error },
        { 
          status: 429,
          headers: createRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt)
        }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.users.findFirst({
      where: { email }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Blocked and deleted accounts cannot sign in
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: "Аккаунт заблокирован" },
        { status: 403 }
      );
    }

    await createUserSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Ошибка входа" },
      { status: 500 }
    );
  }
}
