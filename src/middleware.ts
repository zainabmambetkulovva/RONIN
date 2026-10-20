import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Если пользователь залогинен и профиль не настроен
    if (token && token.needsSetup && path !== "/setup-profile" && !path.startsWith("/api")) {
      // Редирект на setup-profile только если это не уже эта страница
      return NextResponse.redirect(new URL("/setup-profile", req.url));
    }

    // Если профиль настроен и пользователь на setup-profile - на главную
    if (token && !token.needsSetup && path === "/setup-profile") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Разрешаем доступ всем (защищенные роуты проверяются отдельно)
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
