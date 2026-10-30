import { NextResponse, type NextRequest } from "next/server";

export const GOOGLE_STATE_COOKIE = "google-oauth-state";

/** Адрес возврата от Google — тот сайт, на котором начат вход (должен быть добавлен в Google Cloud Console). */
export function googleRedirectUri(req: NextRequest): string {
  return `${req.nextUrl.origin}/api/auth/google/callback`;
}

/** Только внутренние пути; по умолчанию — личный кабинет. */
export function safeCallbackUrl(value: string | null | undefined): string {
  return value && /^\/(?![\/\\])/.test(value) ? value : "/dashboard";
}

export function readGoogleState(req: NextRequest): { state: string; callbackUrl: string; popup: boolean } | null {
  const raw = req.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.state !== "string") return null;
    return { state: parsed.state, callbackUrl: safeCallbackUrl(parsed.callbackUrl), popup: parsed.popup === true };
  } catch {
    return null;
  }
}

/** Канал, по которому окно входа сообщает основной вкладке, что вход завершён (работает и без window.opener). */
export const GOOGLE_AUTH_CHANNEL = "ronin-google-auth";

/**
 * Конец входа через Google. Обычный вход — редирект. Вход в отдельном окне — маленькая страница,
 * которая сообщает основной вкладке адрес перехода и закрывается (страницы Google не остаются в её истории).
 * Если окно не может закрыться (открыто не скриптом), оно само переходит по адресу.
 */
export function finishGoogleAuth(req: NextRequest, popup: boolean, path: string): NextResponse {
  const url = new URL(path, req.url);
  if (!popup) return NextResponse.redirect(url);
  // В скрипт вставляем как JSON с экранированным «<» — адрес не может закрыть тег <script>
  const target = JSON.stringify(url.pathname + url.search).replace(/</g, "\\u003c");
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Вход…</title></head>
<body style="background:#07061a;color:#c4b5fd;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">Вход…
<script>
(function () {
  var target = ${target};
  var msg = { type: "google-auth", target: target };
  try { new BroadcastChannel(${JSON.stringify(GOOGLE_AUTH_CHANNEL)}).postMessage(msg); } catch (e) {}
  try { if (window.opener && !window.opener.closed) window.opener.postMessage(msg, location.origin); } catch (e) {}
  window.close();
  setTimeout(function () { location.replace(target); }, 400);
})();
</script></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
