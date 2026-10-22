import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google - Redirect to Google OAuth
 */
export async function GET() {
  console.log('[Google OAuth Init] Starting redirect...');
  console.log('[Google OAuth Init] Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('[Google OAuth Init] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;
  
  if (!clientId) {
    console.error('[Google OAuth Init] Missing GOOGLE_CLIENT_ID');
    return NextResponse.redirect(new URL('/login?error=config', process.env.NEXTAUTH_URL!));
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  }).toString()}`;

  console.log('[Google OAuth Init] Redirecting to:', authUrl.substring(0, 100) + '...');
  
  return NextResponse.redirect(authUrl);
}
