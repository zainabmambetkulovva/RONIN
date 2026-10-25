import type { NextRequest } from "next/server";

export const GOOGLE_STATE_COOKIE = "google-oauth-state";

/** Адрес возврата от Google — тот сайт, на котором начат вход (должен быть добавлен в Google Cloud Console). */
export function googleRedirectUri(req: NextRequest): string {
  return `${req.nextUrl.origin}/api/auth/google/callback`;
}

/** Только внутренние пути; по умолчанию — личный кабинет. */
export function safeCallbackUrl(value: string | null | undefined): string {
  return value && /^\/(?![\/\\])/.test(value) ? value : "/dashboard";
}

export function readGoogleState(req: NextRequest): { state: string; callbackUrl: string } | null {
  const raw = req.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.state !== "string") return null;
    return { state: parsed.state, callbackUrl: safeCallbackUrl(parsed.callbackUrl) };
  } catch {
    return null;
  }
}
