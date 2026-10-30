/**
 * Названия тарифов хранятся в базе по-русски («1 час», «Утро пакет»). Здесь — перевод типовых названий
 * на английский и кыргызский; своё название, которого нет в списке, показывается как есть.
 */
type Lang = "ru" | "en" | "ky";

const HOURS = /^(\d+)\s*(час|часа|часов|ч)\.?$/i;
const PACKS: Array<{ re: RegExp; en: string; ky: string }> = [
  { re: /^утро(\s*пакет)?$|^утренний(\s*пакет)?$/i, en: "Morning pack", ky: "Эртең мененки пакет" },
  { re: /^ночь(\s*пакет)?$|^ночной(\s*пакет)?$/i, en: "Night pack", ky: "Түнкү пакет" },
  { re: /^день(\s*пакет)?$|^дневной(\s*пакет)?$/i, en: "Day pack", ky: "Күндүзгү пакет" },
];

export function translateTariffName(name: string, lang: Lang): string {
  const clean = name.trim();
  if (lang === "ru") return clean;
  const h = clean.match(HOURS);
  if (h) {
    const n = Number(h[1]);
    return lang === "en" ? `${n} ${n === 1 ? "hour" : "hours"}` : `${n} саат`;
  }
  const pack = PACKS.find((p) => p.re.test(clean));
  return pack ? pack[lang] : clean;
}

/** В названии уже написана длительность («1 час» при 60 минутах) — вторую строку «1 ч» не показываем. */
export function durationInName(name: string, minutes: number): boolean {
  const h = name.trim().match(HOURS);
  return !!h && Number(h[1]) * 60 === minutes;
}
