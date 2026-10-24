import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { clearStaffSession } from "@/server/auth/staff";

export const dynamic = "force-dynamic";

// POST /api/admin/auth/logout - завершить сессию персонала
export const POST = handle(async () => {
  clearStaffSession();
  return NextResponse.json({ success: true });
});
