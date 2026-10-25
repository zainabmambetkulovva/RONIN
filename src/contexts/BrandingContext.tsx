"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { BrandingDTO } from "@/types/api";

/** Стандартное оформление — пока не загрузились настройки клуба (и если их нет). */
export const DEFAULT_BRANDING: BrandingDTO = {
  clubName: "RONIN",
  gradient: ["#e9d5ff", "#d946ef", "#22d3ee"],
  logoUrl: "/logo-new.png",
  heroImageUrl: "/brand/samurai.png",
  customLogo: false,
  customHero: false,
};

interface BrandingContextValue extends BrandingDTO {
  /** Перечитать настройки (после сохранения в админке). */
  refresh: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextValue>({ ...DEFAULT_BRANDING, refresh: async () => undefined });

const CACHE_KEY = "branding:v1";

function applyCssVars(b: BrandingDTO) {
  const root = document.documentElement;
  root.style.setProperty("--brand-1", b.gradient[0]);
  root.style.setProperty("--brand-2", b.gradient[1]);
  root.style.setProperty("--brand-3", b.gradient[2]);
}

/** Оформление сайта клуба: название, логотип, картинка первого экрана и цвета градиента из настроек админки. */
export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingDTO>(DEFAULT_BRANDING);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/branding", { cache: "no-store" });
      if (!res.ok) return;
      const { branding: next } = (await res.json()) as { branding: BrandingDTO };
      setBranding(next);
      applyCssVars(next);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        /* хранилище недоступно — не страшно */
      }
    } catch {
      /* сеть недоступна — остаётся стандартное оформление */
    }
  }, []);

  useEffect(() => {
    // Сначала — последнее известное оформление, чтобы при повторном заходе не мелькали стандартные цвета
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as BrandingDTO;
        setBranding(parsed);
        applyCssVars(parsed);
      }
    } catch {
      /* ignore */
    }
    refresh();
  }, [refresh]);

  return <BrandingContext.Provider value={{ ...branding, refresh }}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
