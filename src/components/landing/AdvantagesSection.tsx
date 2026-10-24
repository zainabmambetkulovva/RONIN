"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarCheck, Clock, CreditCard, QrCode, Star, Wallet, Banknote, ArrowLeftRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { club } from "@/config/club";
import { Reveal, Section, SectionHeading } from "./primitives";

const CARD_COUNT = 6;

export function AdvantagesSection() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // Последовательная неоновая подсветка карточек примерно каждые 3 секунды
  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % CARD_COUNT), 3000);
    return () => clearInterval(timer);
  }, [reduce]);

  const zoneMax = Math.max(...club.zones.map((z) => z.seats));

  return (
    <Section id="advantages" className="bg-rn-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rn-violet/50 to-transparent" aria-hidden />
      <SectionHeading eyebrow={t("adv.eyebrow")} title={t("adv.title")} subtitle={t("adv.subtitle")} />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. Залы — широкая карточка с диаграммой мест */}
        <AdvCard index={0} active={active} className="lg:col-span-2" accent="violet">
          <h3 className="font-display text-xl font-bold uppercase text-white">{t("adv.zones.title")}</h3>
          <p className="mt-2 text-sm text-rn-muted">{t("adv.zones.text")}</p>
          <ul className="mt-6 space-y-3">
            {club.zones.map((zone, i) => (
              <li key={zone.key}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="text-white/90">{t(`adv.zones.${zone.key}`)}</span>
                  <span className="font-display font-bold text-white">{zone.seats}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${
                      i === 0 ? "bg-gradient-to-r from-rn-electric to-rn-cyan" : i === 1 ? "bg-gradient-to-r from-rn-violet to-rn-magenta" : "bg-gradient-to-r from-rn-magenta to-rn-pink"
                    }`}
                    style={{ width: `${Math.max((zone.seats / zoneMax) * 100, 6)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </AdvCard>

        {/* 2. 24/7 — крупная цифра */}
        <AdvCard index={1} active={active} accent="cyan">
          <Clock className="h-6 w-6 text-rn-cyan" />
          <div className="mt-6 font-display text-6xl font-black leading-none text-white">24/7</div>
          <h3 className="mt-4 font-display text-lg font-bold uppercase text-white">{t("adv.open.title")}</h3>
          <p className="mt-2 text-sm text-rn-muted">{t("adv.open.text")}</p>
        </AdvCard>

        {/* 3. Рейтинг */}
        <AdvCard index={2} active={active} accent="pink">
          <div className="flex gap-1" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.round(club.twoGis.rating) ? "fill-rn-pink text-rn-pink" : "text-rn-line"}`} />
            ))}
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-6xl font-black leading-none text-white">{club.twoGis.rating.toFixed(1)}</span>
            <span className="text-sm text-rn-muted">/ 5</span>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold uppercase text-white">{t("adv.rating.title")}</h3>
          <p className="mt-2 text-sm text-rn-muted">
            {t("adv.rating.text")} {club.twoGis.ratingsCount} {t("reviews.ratings")}.
          </p>
        </AdvCard>

        {/* 4. Онлайн-бронь — шаги */}
        <AdvCard index={3} active={active} accent="electric">
          <CalendarCheck className="h-6 w-6 text-rn-electric" />
          <h3 className="mt-6 font-display text-lg font-bold uppercase text-white">{t("adv.booking.title")}</h3>
          <p className="mt-2 text-sm text-rn-muted">{t("adv.booking.text")}</p>
          <div className="mt-6 flex items-center gap-2" aria-hidden>
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rn-electric/50 bg-rn-electric/10 font-display text-xs font-bold text-white">
                  {step}
                </span>
                {step < 3 && <span className="h-px w-6 bg-rn-electric/40" />}
              </div>
            ))}
          </div>
        </AdvCard>

        {/* 5. Оплата — способы */}
        <AdvCard index={4} active={active} accent="magenta">
          <Wallet className="h-6 w-6 text-rn-magenta" />
          <h3 className="mt-6 font-display text-lg font-bold uppercase text-white">{t("adv.payment.title")}</h3>
          <p className="mt-2 text-sm text-rn-muted">{t("adv.payment.text")}</p>
          <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden>
            {[CreditCard, Banknote, ArrowLeftRight, QrCode].map((Icon, i) => (
              <span key={i} className="flex aspect-square items-center justify-center rounded-xl border border-rn-line bg-white/[0.03]">
                <Icon className="h-5 w-5 text-white/80" />
              </span>
            ))}
          </div>
        </AdvCard>

        {/* 6. Атмосфера — фото зала */}
        <AdvCard index={5} active={active} className="lg:col-span-2 min-h-[260px]" accent="purple" padded={false}>
          <Image src="/РОНИН ФОН 2.png" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-rn-void via-rn-void/50 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold uppercase text-white">{t("adv.vibe.title")}</h3>
            <p className="mt-2 max-w-md text-sm text-white/75">{t("adv.vibe.text")}</p>
          </div>
        </AdvCard>
      </div>
    </Section>
  );
}

const ACCENTS = {
  violet: "from-rn-violet via-rn-purple to-rn-electric",
  cyan: "from-rn-cyan via-rn-electric to-rn-violet",
  pink: "from-rn-pink via-rn-magenta to-rn-violet",
  electric: "from-rn-electric via-rn-cyan to-rn-violet",
  magenta: "from-rn-magenta via-rn-pink to-rn-purple",
  purple: "from-rn-purple via-rn-magenta to-rn-cyan",
} as const;

function AdvCard({
  index,
  active,
  accent,
  className = "",
  padded = true,
  children,
}: {
  index: number;
  active: number;
  accent: keyof typeof ACCENTS;
  className?: string;
  padded?: boolean;
  children: ReactNode;
}) {
  const isActive = index === active;
  return (
    <Reveal delay={index * 0.08} className={className}>
      <article
        className={`group relative h-full overflow-hidden rounded-3xl p-px transition-all duration-700 hover:-translate-y-1 ${
          isActive ? "shadow-[0_0_50px_rgba(168,85,247,0.35)]" : "shadow-none"
        }`}
      >
        {/* Градиентная рамка: ярче у активной карточки и при наведении */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${ACCENTS[accent]} transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-20 group-hover:opacity-70"
          }`}
          aria-hidden
        />
        <div className={`relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-rn-surface ${padded ? "p-6 sm:p-7" : ""}`}>
          {padded && (
            <div
              className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${ACCENTS[accent]} blur-3xl transition-opacity duration-700 ${
                isActive ? "opacity-30" : "opacity-0 group-hover:opacity-20"
              }`}
              aria-hidden
            />
          )}
          <div className="relative h-full">{children}</div>
        </div>
      </article>
    </Reveal>
  );
}
