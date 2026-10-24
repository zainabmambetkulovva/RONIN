import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Wrap admin API route with authentication and authorization
 * Use as:
 * 
 * export async function GET(req: NextRequest) {
 *   const adminCheck = await withAdminProtection(req);
 *   if (adminCheck.error) return adminCheck.response;
 * 
 *   // Your admin code here
 *   return NextResponse.json({ success: true });
 * }
 */
export async function withAdminProtection(
  req: NextRequest
): Promise<{ error: false } | { error: true; response: NextResponse }> {
  // Try to get token from cookies
  let token = cookies().get('session-token')?.value;
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return {
      error: true,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Check that it's an admin session
    if (payload.type !== 'admin_session' && payload.role !== 'admin') {
      return {
        error: true,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
    
    return { error: false };
  } catch (error) {
    console.error('Admin JWT verify error:', error);
    return {
      error: true,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}
