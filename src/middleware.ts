import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STAFF_SESSION_COOKIE, USER_SESSION_COOKIE } from "@/server/config";
import { verifyStaffToken, verifyUserToken } from "@/server/auth/tokens";

/**
 * Edge middleware: только маршрутизация страниц.
 * Права на данные всегда проверяются в API-роутах (`src/server/auth/*`).
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Панель управления и панель менеджера: без сессии персонала — на страницу входа
  const isStaffArea = (path.startsWith("/admin") && path !== "/admin/login") || path.startsWith("/manager");
  if (isStaffArea) {
    const staffToken = req.cookies.get(STAFF_SESSION_COOKIE)?.value;
    const staff = staffToken ? await verifyStaffToken(staffToken) : null;
    if (!staff) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  if (path === "/" || path === "/login" || path === "/register" || path === "/forgot-password") {
    return NextResponse.next();
  }

  const token = req.cookies.get(USER_SESSION_COOKIE)?.value;
  if (!token) return NextResponse.next();

  const payload = await verifyUserToken(token);
  if (!payload) return NextResponse.next();

  // Профиль не настроен — сначала setup-profile
  if (payload.needsSetup && payload.role === "client" && path !== "/setup-profile") {
    return NextResponse.redirect(new URL("/setup-profile", req.url));
  }

  if (!payload.needsSetup && path === "/setup-profile") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|json|txt)$).*)",
  ],
};
