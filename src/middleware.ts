import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { checkRateLimit, createRateLimitHeaders, rateLimitError } from "@/lib/rate-limiter";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Пропускаем публичные пути и API
  if (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Проверяем session token
  const token = req.cookies.get('session-token')?.value;
  
  if (!token) {
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Если профиль не настроен и это клиент
    if (payload.needsSetup && payload.role === 'client' && path !== "/setup-profile") {
      console.log('Redirecting to setup-profile');
      return NextResponse.redirect(new URL("/setup-profile", req.url));
    }

    // Если профиль настроен и пользователь на setup-profile
    if (!payload.needsSetup && path === "/setup-profile") {
      console.log('Redirecting from setup-profile to home');
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.error('JWT verify error:', error);
  }

  return NextResponse.next();
}

// Admin middleware для защиты админских API
export async function adminMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Ищем токен в cookies
  let token = req.cookies.get('session-token')?.value;
  
  // Если session-token не найден, проверяем Authorization header (для API вызовов)
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Проверка, что это админская сессия (не пользовательская)
    if (payload.type !== 'admin_session' && payload.role !== 'admin') {
      console.error('Admin access denied for user:', payload.email || payload.userId);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Admin JWT verify error:', error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
