/**
 * Общие настройки бэкенда RONIN.
 * Файл не импортирует Node-модули, поэтому его можно использовать и в middleware (Edge runtime).
 */

/** Cookie пользовательской сессии (клиенты). Имя сохранено для совместимости с уже выданными сессиями. */
export const USER_SESSION_COOKIE = "session-token";
export const USER_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 дней

/** Cookie сессии персонала (admin / manager) — выдаётся только после Telegram-кода. */
export const STAFF_SESSION_COOKIE = "admin-token";
export const STAFF_SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 часов

/** Временный токен между вводом пароля и вводом 2FA-кода. */
export const TWO_FACTOR_TTL_SECONDS = 5 * 60;
export const TWO_FACTOR_MAX_ATTEMPTS = 5;

/**
 * Сколько минут неоплаченная (pending) бронь удерживает компьютер.
 * После этого компьютер снова доступен другим клиентам.
 */
export const BOOKING_HOLD_MINUTES = 10;

export function getAuthSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}
