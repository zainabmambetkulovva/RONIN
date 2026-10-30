"use client";

/** Тот же канал, что в src/app/api/auth/google/oauth.ts (сюда его не импортируем — там серверный код). */
const CHANNEL = "ronin-google-auth";

/**
 * Вход через Google в отдельном окне (на телефоне — во вкладке): страницы Google не попадают в историю
 * текущей вкладки, и «Назад» после входа не возвращает на выбор аккаунта.
 * Окно заблокировано браузером — обычный вход в этой же вкладке.
 */
export function startGoogleSignIn(callbackUrl?: string | null) {
  const query = new URLSearchParams({ popup: "1" });
  if (callbackUrl) query.set("callbackUrl", callbackUrl);
  const fallback = `/api/auth/google${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;

  const w = 500;
  const h = 640;
  const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);
  const popup = window.open(`/api/auth/google?${query}`, "google-signin", `width=${w},height=${h},left=${left},top=${top}`);
  if (!popup) {
    window.location.href = fallback;
    return;
  }

  let done = false;
  let bc: BroadcastChannel | null = null;
  const finish = (target: unknown) => {
    if (done || typeof target !== "string" || !target.startsWith("/")) return;
    done = true;
    window.removeEventListener("message", onMessage);
    bc?.close();
    // replace: страница входа тоже не остаётся в истории
    window.location.replace(target);
  };
  const onMessage = (e: MessageEvent) => {
    if (e.origin === window.location.origin && e.data?.type === "google-auth") finish(e.data.target);
  };
  window.addEventListener("message", onMessage);
  try {
    bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (e) => e.data?.type === "google-auth" && finish(e.data.target);
  } catch {
    bc = null;
  }
}
