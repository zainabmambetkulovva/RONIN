import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Пропускаем все публичные страницы и API
    if (
      path === "/" ||
      path === "/login" ||
      path === "/register" ||
      path === "/forgot-password" ||
      path.startsWith("/api") ||
      path.startsWith("/admin")
    ) {
      return NextResponse.next();
    }

    // Если НЕТ токена - разрешаем доступ (публичные страницы)
    if (!token) {
      return NextResponse.next();
    }

    // Если пользователь залогинен и профиль не настроен
    // НО исключаем админов и менеджеров - у них профиль опционален
    if (
      token.needsSetup && 
      token.role === "client" && // Только для клиентов
      path !== "/setup-profile"
    ) {
      // Редирект на setup-profile только для клиентов
      return NextResponse.redirect(new URL("/setup-profile", req.url));
    }

    // Если профиль настроен и пользователь на setup-profile - на главную
    if (!token.needsSetup && path === "/setup-profile") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Всегда разрешаем доступ - логику проверяем в middleware функции
        return true;
      },
    },
  }
);

// Применяем middleware только к определенным путям
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
