import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { GOOGLE_STATE_COOKIE, finishGoogleAuth, googleRedirectUri, safeCallbackUrl } from "./oauth";

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google[?callbackUrl=/booking] - Redirect to Google OAuth
 *
 * redirect_uri строится от адреса, на котором открыт сайт (production или preview),
 * поэтому после входа пользователь возвращается на тот же сайт.
 * state защищает от подмены ответа (CSRF) и хранит, куда вернуться после входа.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  // popup=1 — вход в отдельном окне (основная вкладка не получает страниц Google в историю)
  const popup = req.nextUrl.searchParams.get('popup') === '1';

  if (!clientId) {
    console.error('[Google OAuth Init] Missing GOOGLE_CLIENT_ID');
    return finishGoogleAuth(req, popup, '/login?error=config');
  }

  const state = crypto.randomBytes(16).toString('hex');
  const callbackUrl = safeCallbackUrl(req.nextUrl.searchParams.get('callbackUrl'));

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(req),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    // Всегда показывать выбор аккаунта Google
    prompt: 'select_account',
  }).toString()}`;

  const res = NextResponse.redirect(authUrl);
  res.cookies.set(GOOGLE_STATE_COOKIE, JSON.stringify({ state, callbackUrl, popup }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/google',
    maxAge: 10 * 60,
  });
  return res;
}
