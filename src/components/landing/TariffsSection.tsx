"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Moon, Package, Sun, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { club } from "@/config/club";
import type { TariffDTO, TariffType } from "@/types/api";
import { Reveal, Section, SectionHeading } from "./primitives";
import { formatDuration, formatPrice, useClubData } from "./useClubData";

const GENERAL = "__general__";

const TYPE_STYLE: Record<TariffType, { icon: typeof Clock; glow: string; chip: string; line: string }> = {
  hourly: { icon: Clock, glow: "bg-rn-electric/30", chip: "text-rn-cyan border-rn-cyan/40", line: "from-rn-electric to-rn-cyan" },
  package: { icon: Package, glow: "bg-rn-violet/35", chip: "text-rn-purple border-rn-purple/40", line: "from-rn-violet to-rn-magenta" },
  night: { icon: Moon, glow: "bg-rn-magenta/30", chip: "text-rn-magenta border-rn-magenta/40", line: "from-rn-magenta to-rn-violet" },
  morning: { icon: Sun, glow: "bg-rn-pink/25", chip: "text-rn-pink border-rn-pink/40", line: "from-rn-pink to-rn-cyan" },
};

interface Group {
  id: string;
  name: string;
  tariffs: TariffDTO[];
  minPrice: number;
}

export function TariffsSection() {
  const { t } = useLanguage();
  const state = useClubData();
  const [selected, setSelected] = useState<string | null>(null);

  // Группы по залам (категориям), от доступных к премиальным
  const groups = useMemo<Group[]>(() => {
    if (state.status !== "ready") return [];
    const map = new Map<string, Group>();
    for (const tariff of state.data.tariffs) {
      const id = tariff.categoryId ?? GENERAL;
      const name = tariff.category?.name ?? t("tariffs.general");
      const group = map.get(id) ?? { id, name, tariffs: [], minPrice: Infinity };
      group.tariffs.push(tariff);
      group.minPrice = Math.min(group.minPrice, tariff.price);
      map.set(id, group);
    }
    return Array.from(map.values())
      .map((g) => ({ ...g, tariffs: g.tariffs.sort((a, b) => a.price - b.price) }))
      .sort((a, b) => a.minPrice - b.minPrice);
  }, [state, t]);

  const current = groups.find((g) => g.id === selected) ?? groups[0];

  return (
    <Section id="tariffs" className="overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-rn-electric/15 blur-[120px]" aria-hidden />
      <SectionHeading eyebrow={t("tariffs.eyebrow")} title={t("tariffs.title")} subtitle={t("tariffs.subtitle")} />

      {state.status === "loading" && (
        <div className="flex gap-5 overflow-hidden" aria-busy="true" aria-label={t("tariffs.loading")}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[340px] w-[280px] shrink-0 animate-pulse rounded-3xl border border-rn-line bg-rn-surface/60" />
          ))}
        </div>
      )}

      {state.status === "error" && <p className="rounded-2xl border border-rn-pink/30 bg-rn-pink/5 p-6 text-rn-muted">{t("tariffs.error")}</p>}

      {state.status === "ready" && groups.length === 0 && (
        <p className="rounded-2xl border border-rn-line bg-rn-surface/60 p-6 text-rn-muted">{t("tariffs.empty")}</p>
      )}

      {current && (
        <>
          {groups.length > 1 && (
            <Reveal>
              <div role="tablist" aria-label={t("tariffs.title")} className="rn-no-scrollbar -mx-4 mb-2 flex gap-2 overflow-x-auto px-4">
                {groups.map((g) => {
                  const isActive = g.id === current.id;
                  return (
                    <button
                      key={g.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelected(g.id)}
                      className={`relative shrink-0 rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition ${
                        isActive ? "text-white" : "text-rn-muted hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="tariff-tab"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-rn-violet to-rn-magenta shadow-[0_0_24px_rgba(217,70,239,0.45)]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <HorizontalCarousel ariaLabel={`${t("tariffs.title")}: ${current.name}`} itemClassName="w-[260px] sm:w-[290px]">
                {current.tariffs.map((tariff) => (
                  <TariffCard key={tariff.id} tariff={tariff} />
                ))}
              </HorizontalCarousel>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </Section>
  );
}

function TariffCard({ tariff }: { tariff: TariffDTO }) {
  const { t } = useLanguage();
  const style = TYPE_STYLE[tariff.type];
  const Icon = style.icon;
  const timeWindow = tariff.type === "night" ? club.tariffWindows.night : tariff.type === "morning" ? club.tariffWindows.morning : null;
  const bookingHref = tariff.categoryId ? `/booking?categoryId=${encodeURIComponent(tariff.categoryId)}` : "/booking";

  return (
    <article
      className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-3xl border border-rn-line bg-rn-surface p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-rn-violet/60"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl transition-opacity duration-500 ${style.glow} opacity-60 group-hover:opacity-100`} aria-hidden />
      <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${style.line} opacity-70`} aria-hidden />

      <div className="relative flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${style.chip}`}>
          <Icon className="h-3.5 w-3.5" />
          {t(`tariffs.type.${tariff.type}`)}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-2xl font-bold uppercase leading-tight text-white">{tariff.name}</h3>
      <p className="relative mt-2 text-sm text-rn-muted">
        {formatDuration(tariff.durationMinutes, t)}
        {timeWindow ? ` · ${timeWindow}` : ""}
      </p>

      <div className="relative mt-auto pt-8">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-black text-white">{formatPrice(tariff.price)}</span>
          <span className="text-sm font-semibold uppercase text-rn-muted">{t("tariffs.currency")}</span>
        </div>
        <Link
          href={bookingHref}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rn-line bg-white/[0.03] py-3 text-sm font-bold uppercase tracking-wider text-white transition group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-rn-violet group-hover:to-rn-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rn-cyan"
        >
          {t("tariffs.choose")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
