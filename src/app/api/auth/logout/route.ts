import { NextResponse } from "next/server";
import { clearUserSession } from "@/server/auth/session";

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout - Logout user
 */
export async function POST() {
  try {
    clearUserSession();
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('[Logout] Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
