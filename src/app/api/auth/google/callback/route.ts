import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google/callback - Handle Google OAuth callback
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', req.url));
    }

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
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/login?error=token_exchange', req.url));
    }

    const tokens = await tokenResponse.json();
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    if (!userResponse.ok) {
      console.error('User info fetch failed');
      return NextResponse.redirect(new URL('/login?error=user_info', req.url));
    }

    const googleUser = await userResponse.json();
    
    // Check if user exists
    let user = await prisma.users.findFirst({
      where: { email: googleUser.email }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: googleUser.email,
          name: null, // Will be set in setup-profile
          avatar: null,
          role: 'client',
          status: 'active',
          email_verified: new Date(),
          image: googleUser.picture,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Create JWT session token
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

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    // Redirect to home (middleware will handle setup-profile redirect)
    return NextResponse.redirect(new URL('/', req.url));
    
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_error', req.url));
  }
}
