/** Форматирование дат, времени и денег для интерфейса (локаль по языку сайта). */

export type UiLanguage = "ru" | "en" | "ky";

const LOCALES: Record<UiLanguage, string> = { ru: "ru-RU", en: "en-GB", ky: "ky-KG" };

export function formatDate(iso: string | Date, lang: UiLanguage, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(LOCALES[lang], { day: "numeric", month: "long", ...opts }).format(new Date(iso));
}

export function formatTime(iso: string | Date, lang: UiLanguage) {
  return new Intl.DateTimeFormat(LOCALES[lang], { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
}

export function formatTimeRange(startIso: string, endIso: string, lang: UiLanguage) {
  return `${formatTime(startIso, lang)} – ${formatTime(endIso, lang)}`;
}

export function formatMoney(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} сом`;
}

/** Ключ дня YYYY-MM-DD в локальном времени браузера. */
export function dayKey(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Локальная дата + "HH:MM" → Date. */
export function combineDayTime(day: string, time: string) {
  const [y, m, d] = day.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}
