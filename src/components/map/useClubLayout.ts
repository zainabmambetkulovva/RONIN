"use client";

import { useMemo } from "react";
import { useBranding } from "@/contexts/BrandingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildLayoutFromHalls, hallsFromComputers, hallsFromZones, type ClubLayout } from "@/config/club-layout";

const PC_LABEL: Record<string, (n: number) => string> = {
  en: (n) => `${n} ${n === 1 ? "PC" : "PCs"}`,
  ky: (n) => `${n} компьютер`,
};

/**
 * Схема зала. Если переданы компьютеры из базы — строится по ним (залы = категории, реальные номера),
 * поэтому карта всегда совпадает с админкой. Пока компьютеров нет — по зонам из настроек клуба.
 */
export function useClubLayout(computers?: Array<{ number: number; category: { name: string } }> | null): ClubLayout {
  const { zones } = useBranding();
  const { language } = useLanguage();
  const fromDb = computers && computers.length > 0;
  const key = fromDb
    ? computers.map((c) => `${c.number}:${c.category.name}`).join(",")
    : JSON.stringify(zones.map((z) => [z.label, z.count, z.columns]));
  return useMemo(
    () => buildLayoutFromHalls(fromDb ? hallsFromComputers(computers) : hallsFromZones(zones), PC_LABEL[language]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, language]
  );
}
