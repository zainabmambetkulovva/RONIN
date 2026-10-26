"use client";

import { useMemo } from "react";
import { Monitor, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, Section, SectionHeading } from "./primitives";
import { useClubData } from "./useClubData";
import { ClubMap } from "@/components/map/ClubMap";

interface HallStats {
  id: string;
  name: string;
  description: string;
  total: number;
  free: number;
  maintenance: number;
}

export function ComputersSection() {
  const { t } = useLanguage();
  const state = useClubData();

  // Статистика по залам — только из реальных данных
  const halls = useMemo<HallStats[]>(() => {
    if (state.status !== "ready") return [];
    return state.data.categories
      .map((category) => {
        const pcs = state.data.computers.filter((c) => c.categoryId === category.id);
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          total: pcs.length,
          free: pcs.filter((c) => c.availableForSlot).length,
          maintenance: pcs.filter((c) => c.status === "maintenance").length,
        };
      })
      .filter((h) => h.total > 0);
  }, [state]);

  return (
    <Section id="computers" className="bg-rn-night">
      <SectionHeading eyebrow={t("pcs.eyebrow")} title={t("pcs.title")} subtitle={t("pcs.subtitle")} />

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Залы — компактно */}
        <div className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {state.status === "loading" &&
            [0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl border border-rn-line bg-rn-surface/60" />)}

          {state.status === "error" && (
            <p className="rounded-2xl border border-rn-pink/30 bg-rn-pink/5 p-4 text-sm text-rn-muted sm:col-span-3 lg:col-span-1">{t("pcs.error")}</p>
          )}

          {halls.map((hall, i) => (
            <Reveal key={hall.id} delay={i * 0.06} y={16}>
              <article className="group flex items-center justify-between gap-3 rounded-2xl border border-rn-line bg-rn-surface px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-rn-violet/60">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase text-white">
                    <Monitor className="h-4 w-4 shrink-0 text-rn-purple" />
                    <span className="truncate">{hall.name}</span>
                  </h3>
                  <p className="mt-1 text-xs text-rn-muted">
                    {t("pcs.total")}: {hall.total}
                    {hall.maintenance > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> {hall.maintenance}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 font-display text-xl font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                    {hall.free}
                  </div>
                  <div className="text-[9px] uppercase text-rn-muted">{t("pcs.freeNow")}</div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* 3D-карта клуба */}
        <Reveal delay={0.1} className="min-w-0">
          <div id="map" className="scroll-mt-24">
            <ClubMap compact />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
