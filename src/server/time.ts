/**
 * Время клуба. Кыргызстан живёт по UTC+6 круглый год (без перехода на летнее время),
 * а сервер (Vercel) — в UTC. Границы «сегодня», «эта неделя» считаются по Бишкеку.
 */
export const BISHKEK_OFFSET_MIN = 6 * 60;

/** Текущий момент, сдвинутый так, что UTC-поля показывают бишкекское время. */
export function bishkekShifted(date = new Date()) {
  return new Date(date.getTime() + BISHKEK_OFFSET_MIN * 60_000);
}

/** UTC-момент для «день (смещение от сегодня) + hh:mm по Бишкеку». */
export function bishkekMoment(dayOffset: number, h = 0, m = 0) {
  const local = bishkekShifted();
  return new Date(
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + dayOffset, h, m) - BISHKEK_OFFSET_MIN * 60_000
  );
}

/** Начало текущих суток по Бишкеку. */
export function bishkekStartOfToday() {
  return bishkekMoment(0);
}

export type StatsPeriod = "today" | "week" | "month";

/** Интервал [from, to) для периода статистики. */
export function periodRange(period: StatsPeriod) {
  const to = bishkekMoment(1);
  const from = period === "today" ? bishkekMoment(0) : period === "week" ? bishkekMoment(-6) : bishkekMoment(-29);
  return { from, to };
}
