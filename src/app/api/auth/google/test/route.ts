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
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
    nodeEnv: process.env.NODE_ENV,
  };

  // Construct OAuth URL
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
    message: 'Google OAuth configuration is loaded'
  });
}
