import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google/callback - Handle Google OAuth callback
 */
export async function GET(req: NextRequest) {
  console.log('[Google OAuth Callback] Started');
  
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    console.log('[Google OAuth Callback] Code exists:', !!code);
    console.log('[Google OAuth Callback] Error param:', error);
    
    if (error) {
      console.error('[Google OAuth Callback] OAuth error from Google:', error);
      return NextResponse.redirect(new URL(`/login?error=${error}`, req.url));
    }
    
    if (!code) {
      console.error('[Google OAuth Callback] No code provided');
      return NextResponse.redirect(new URL('/login?error=no_code', req.url));
    }

    console.log('[Google OAuth Callback] Exchanging code for tokens...');
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Google OAuth Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/login?error=token_exchange', req.url));
    }

    const tokens = await tokenResponse.json();
    console.log('[Google OAuth Callback] Tokens received, fetching user info...');
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    if (!userResponse.ok) {
      console.error('[Google OAuth Callback] User info fetch failed');
      return NextResponse.redirect(new URL('/login?error=user_info', req.url));
    }

    const googleUser = await userResponse.json();
    console.log('[Google OAuth Callback] User info received:', googleUser.email);
    
    // Check if user exists
    let user = await prisma.users.findFirst({
      where: { email: googleUser.email }
    });

    // Create user if doesn't exist
    if (!user) {
      console.log('[Google OAuth Callback] Creating new user...');
      user = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: googleUser.email,
          name: googleUser.name || null,
          avatar: null,
          role: 'client',
          status: 'active',
          email_verified: new Date(),
          image: googleUser.picture,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('[Google OAuth Callback] User created:', user.id);
    } else {
      console.log('[Google OAuth Callback] Existing user found:', user.id);
    }

    // Create JWT session token
    console.log('[Google OAuth Callback] Creating session token...');
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      needsSetup: !user.name || !user.avatar
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    console.log('[Google OAuth Callback] Setting session cookie...');
    
    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    console.log('[Google OAuth Callback] Success! Redirecting to home...');
    
    // Redirect to home (middleware will handle setup-profile redirect if needed)
    return NextResponse.redirect(new URL('/', req.url));
    
  } catch (error: any) {
    console.error('[Google OAuth Callback] Fatal error:', error.message);
    console.error('[Google OAuth Callback] Stack:', error.stack);
    return NextResponse.redirect(new URL('/login?error=oauth_error', req.url));
  }
}
