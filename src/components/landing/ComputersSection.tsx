"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Map, Monitor, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, Section, SectionHeading } from "./primitives";
import { useClubData } from "./useClubData";

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

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Залы */}
        <div className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {state.status === "loading" &&
            [0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-3xl border border-rn-line bg-rn-surface/60" />)}

          {state.status === "error" && (
            <p className="rounded-2xl border border-rn-pink/30 bg-rn-pink/5 p-6 text-rn-muted sm:col-span-2">{t("pcs.error")}</p>
          )}

          {halls.map((hall, i) => (
            <Reveal key={hall.id} delay={i * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-rn-line bg-rn-surface p-6 transition hover:border-rn-violet/60">
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-rn-violet/20 blur-3xl transition-opacity group-hover:opacity-100" aria-hidden />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold uppercase text-white">{hall.name}</h3>
                  <Monitor className="h-5 w-5 shrink-0 text-rn-purple" />
                </div>
                {hall.description && <p className="mt-2 line-clamp-2 text-sm text-rn-muted">{hall.description}</p>}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <Stat value={hall.total} label={t("pcs.total")} tone="text-white" />
                  <Stat value={hall.free} label={t("pcs.freeNow")} tone="text-emerald-400" dot="bg-emerald-400" />
                  <Stat value={hall.maintenance} label={t("pcs.maintenance")} tone="text-rn-muted" icon />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Карта клуба — вход в будущую 3D-карту */}
        <Reveal delay={0.15}>
          <Link
            href="/booking"
            className="group relative flex h-full min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl border border-rn-violet/40 bg-gradient-to-br from-rn-surface-2 via-rn-surface to-rn-void p-7 transition hover:border-rn-magenta/70 hover:shadow-[0_0_60px_rgba(217,70,239,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rn-cyan sm:p-9"
          >
            {/* Декоративная схема зала (не интерактивная) */}
            <div className="pointer-events-none absolute inset-0 [perspective:900px]" aria-hidden>
              <div className="absolute inset-x-[-10%] bottom-[-25%] top-[30%] origin-bottom [transform:rotateX(58deg)] transition-transform duration-700 group-hover:[transform:rotateX(52deg)]">
                <div className="rn-grid-bg absolute inset-0 opacity-70" />
                <div className="absolute inset-0 grid grid-cols-12 content-center gap-3 px-[12%]">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <span
                      key={i}
                      className={`aspect-square rounded-[3px] ${
                        i % 11 === 3 ? "bg-rn-magenta/80 shadow-[0_0_12px_#d946ef]" : i % 7 === 0 ? "bg-rn-cyan/70 shadow-[0_0_10px_#22d3ee]" : "bg-rn-violet/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-rn-surface via-rn-surface/60 to-transparent" />
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-rn-cyan/40 bg-rn-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-rn-cyan">
                <Map className="h-3.5 w-3.5" />
                {t("pcs.map.soon")}
              </span>
              <h3 className="mt-5 font-display text-3xl font-black uppercase text-white sm:text-4xl">{t("pcs.map.title")}</h3>
              <p className="mt-3 max-w-md text-sm text-rn-muted sm:text-base">{t("pcs.map.text")}</p>
            </div>

            <span className="relative mt-10 inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-rn-violet to-rn-magenta px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition group-hover:gap-3">
              {t("pcs.map.cta")}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

function Stat({ value, label, tone, dot, icon }: { value: number; label: string; tone: string; dot?: string; icon?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] px-2 py-3">
      <div className={`flex items-center justify-center gap-1.5 font-display text-2xl font-bold ${tone}`}>
        {dot && <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />}
        {icon && <Wrench className="h-4 w-4" aria-hidden />}
        {value}
      </div>
      <div className="mt-1 hyphens-auto text-[9px] uppercase leading-tight text-rn-muted sm:text-[10px]">{label}</div>
    </div>
  );
}
