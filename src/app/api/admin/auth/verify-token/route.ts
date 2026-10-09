import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getAdminTokenFromRequest } from "@/middleware/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const token = getAdminTokenFromRequest(req);
    
    if (!token) {
      return NextResponse.json(
        { error: "Токен не предоставлен" },
        { status: 401 }
      );
    }

    const payload = verifyAdminToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Ошибка проверки токена" },
      { status: 500 }
    );
  }
}
