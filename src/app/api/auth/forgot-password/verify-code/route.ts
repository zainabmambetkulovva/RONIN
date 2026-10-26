import { NextRequest, NextResponse } from "next/server";
import { RESET_ERRORS, checkResetCode } from "@/server/services/password-reset";

// POST /api/auth/forgot-password/verify-code — проверить код из письма (код не расходуется)
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email и код обязательны" }, { status: 400 });
    }
    const check = await checkResetCode(String(email), String(code));
    if (!check.ok) return NextResponse.json({ error: RESET_ERRORS[check.reason] }, { status: 401 });
    return NextResponse.json({ success: true, message: "Код подтвержден" });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: "Ошибка проверки кода" }, { status: 500 });
  }
}
