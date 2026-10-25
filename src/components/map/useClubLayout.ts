"use client";

import { useMemo } from "react";
import { useBranding } from "@/contexts/BrandingContext";
import { buildLayout, type ClubLayout } from "@/config/club-layout";

/** Схема зала из настроек клуба (зоны и количество ПК задаёт администратор). */
export function useClubLayout(): ClubLayout {
  const { zones } = useBranding();
  const key = JSON.stringify(zones.map((z) => [z.label, z.count, z.columns]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildLayout(zones), [key]);
}
