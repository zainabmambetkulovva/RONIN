import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { requireStaff } from "@/server/auth/staff";

export const dynamic = "force-dynamic";

/**
 * Проверка сессии персонала (cookie `admin-token` или `Authorization: Bearer`).
 * Возвращает текущего сотрудника — используется оболочкой панели управления (StaffShell).
 */
async function verify(req: Request) {
  const user = await requireStaff(req);
  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
}

export const GET = handle(verify);
export const POST = handle(verify);
