import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google/test - Test Google OAuth configuration
 */
export async function GET(req: NextRequest) {
  const config = {
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    nodeEnv: process.env.NODE_ENV,
  };

  // Construct OAuth URL (NextAuth format)
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  }).toString()}`;

  return NextResponse.json({
    status: 'OK',
    config,
    authUrl: authUrl.substring(0, 150) + '...',
    correctRedirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    message: 'Google OAuth configuration (NextAuth). Add this redirect URI to Google Console!'
  });
}
