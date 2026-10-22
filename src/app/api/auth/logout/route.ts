import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout - Logout user
 */
export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Delete session cookie
    cookieStore.delete('session-token');
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('[Logout] Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
