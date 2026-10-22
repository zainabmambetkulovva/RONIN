import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google - Redirect to Google OAuth
 */
export async function GET(req: NextRequest) {
  console.log('[Google OAuth Init] Starting redirect...');
  console.log('[Google OAuth Init] Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('[Google OAuth Init] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;
  
  if (!clientId) {
    console.error('[Google OAuth Init] Missing GOOGLE_CLIENT_ID');
    return NextResponse.redirect(new URL('/login?error=config', req.url));
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  console.log('[Google OAuth Init] Redirect URI:', redirectUri);
  console.log('[Google OAuth Init] Redirecting to Google...');
  
  return NextResponse.redirect(authUrl);
}
