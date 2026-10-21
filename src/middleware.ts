import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log('Middleware:', { path });

  // Пропускаем публичные пути
  if (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
