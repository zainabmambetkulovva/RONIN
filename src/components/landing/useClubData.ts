"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { CategoryDTO, ComputerDTO, TariffDTO } from "@/types/api";

export interface ClubData {
  tariffs: TariffDTO[];
  categories: CategoryDTO[];
  /** Компьютеры с `availableForSlot` на ближайший час. */
  computers: ComputerDTO[];
}

type State =
  | { status: "loading"; data: null }
  | { status: "ready"; data: ClubData }
  | { status: "error"; data: null };

let cache: Promise<ClubData> | null = null;

function load(): Promise<ClubData> {
  // Один запрос на страницу, даже если данные нужны нескольким секциям
  if (!cache) {
    cache = Promise.all([
      api.tariffs(),
      api.categories(),
      api.computers({ start: new Date().toISOString(), durationMinutes: 60 }),
    ])
      .then(([t, c, p]) => ({ tariffs: t.tariffs, categories: c.categories, computers: p.computers }))
      .catch((error) => {
        cache = null;
        throw error;
      });
  }
  return cache;
}

/** Реальные данные клуба для лендинга: тарифы, категории, доступность ПК. */
export function useClubData(): State {
  const [state, setState] = useState<State>({ status: "loading", data: null });

  useEffect(() => {
    let alive = true;
    load()
      .then((data) => alive && setState({ status: "ready", data }))
      .catch(() => alive && setState({ status: "error", data: null }));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export function formatDuration(minutes: number, t: (key: string) => string) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} ${t("tariffs.hours")} ${m} ${t("tariffs.minutes")}`;
  if (h) return `${h} ${t("tariffs.hours")}`;
  return `${m} ${t("tariffs.minutes")}`;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}
