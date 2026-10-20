import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Токен отсутствует" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Проверяем JWT токен
    try {
      const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production";
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: string;
        email: string;
        role: string;
        type: string;
      };

      // Проверяем что это админский токен
      if (decoded.type !== "admin_session") {
        return NextResponse.json(
          { error: "Неверный тип токена" },
          { status: 401 }
        );
      }

      // Проверяем роль
      if (decoded.role !== "admin" && decoded.role !== "manager") {
        return NextResponse.json(
          { error: "Недостаточно прав" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Токен истек или невалиден" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}
