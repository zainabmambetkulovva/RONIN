"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Monitor, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { club } from "@/config/club";
import { useClubData } from "./useClubData";

export function HeroSection() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const clubData = useClubData();
  const pcCount = clubData.status === "ready" ? clubData.data.computers.length : null;

  const slogan = [t("hero.slogan1"), t("hero.slogan2"), t("hero.slogan3")];
  const character = club.heroCharacter ?? "/logo-new.png";

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      {/* Фон: фото зала + световые пятна + сетка */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/РОНИН фон.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-bottom opacity-[0.14] blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rn-void/40 via-rn-void/70 to-rn-night" />
        <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-rn-violet/30 blur-[120px] motion-safe:animate-rn-drift" />
        <div className="absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full bg-rn-magenta/25 blur-[120px] motion-safe:animate-rn-drift [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-rn-cyan/15 blur-[110px] motion-safe:animate-rn-drift [animation-delay:-12s]" />
        <div className="rn-grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        {/* Плавный переход к следующей секции */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-rn-night" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        {/* Текст */}
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-rn-line bg-rn-surface/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-rn-muted backdrop-blur sm:text-xs sm:tracking-[0.25em]"
          >
            <span className="h-2 w-2 rounded-full bg-rn-cyan shadow-[0_0_12px_#22d3ee] motion-safe:animate-rn-pulse" />
            {t("hero.eyebrow")}
          </motion.p>

          <h1 className="relative font-display font-black uppercase leading-[0.85] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: reduce ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rn-text-gradient block text-[clamp(4.5rem,16vw,11.5rem)] drop-shadow-[0_0_40px_rgba(168,85,247,0.35)]"
            >
              RONIN
            </motion.span>
            {/* Контурное «эхо» заголовка для глубины */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1 top-2 -z-10 block select-none text-[clamp(4.5rem,16vw,11.5rem)] text-transparent [-webkit-text-stroke:1px_rgba(34,211,238,0.35)]"
            >
              RONIN
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-display text-2xl font-bold uppercase sm:text-3xl">
            {slogan.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 + i * 0.15 }}
                className={i === 0 ? "text-white" : i === 1 ? "text-rn-magenta" : "text-rn-cyan"}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 max-w-xl text-base text-rn-muted sm:text-lg"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="mt-10"
          >
            <Link
              href="/booking"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-rn-magenta via-rn-purple to-rn-electric px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_40px_rgba(217,70,239,0.45)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(217,70,239,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rn-cyan"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Факты: только подтверждённые данные */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-3"
          >
            <HeroStat icon={<Clock className="h-4 w-4 text-rn-cyan" />} value="24/7" label={t("hero.stat.open")} />
            <HeroStat
              icon={<Star className="h-4 w-4 fill-rn-pink text-rn-pink" />}
              value={club.twoGis.rating.toFixed(1)}
              label={t("hero.stat.rating")}
            />
            <HeroStat
              icon={<Monitor className="h-4 w-4 text-rn-purple" />}
              value={pcCount !== null ? String(pcCount) : "—"}
              label={t("hero.stat.pcs")}
            />
          </motion.dl>
        </div>

        {/* Персонаж: самурай (портрет 2:3) или логотип, вокруг — световые кольца */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`relative mx-auto w-full ${
            club.heroCharacter
              ? "aspect-[4/5] max-w-[320px] sm:max-w-[440px] lg:max-w-[540px]"
              : "aspect-square max-w-[300px] sm:max-w-[420px] lg:max-w-[520px]"
          }`}
        >
          <div className="absolute left-1/2 top-[6%] aspect-square w-[92%] -translate-x-1/2" aria-hidden>
            <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-rn-violet/45 via-rn-magenta/35 to-rn-cyan/20 blur-3xl motion-safe:animate-rn-pulse" />
            <div className="absolute inset-[2%] rounded-full border border-rn-violet/30 motion-safe:animate-[spin_40s_linear_infinite]">
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-rn-cyan shadow-[0_0_14px_#22d3ee]" />
            </div>
            <div className="absolute inset-[14%] rounded-full border border-dashed border-rn-magenta/25 motion-safe:animate-[spin_60s_linear_infinite_reverse]" />
          </div>
          {/* Свет «пола» под персонажем */}
          <div className="absolute bottom-[2%] left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-full bg-rn-magenta/30 blur-2xl" aria-hidden />
          <div className="relative h-full w-full drop-shadow-[0_0_40px_rgba(168,85,247,0.45)] motion-safe:animate-rn-float">
            <Image
              src={character}
              alt={club.heroCharacter ? "Самурай RONIN" : "RONIN"}
              fill
              priority
              sizes="(min-width: 1024px) 540px, (min-width: 640px) 440px, 320px"
              className={`object-contain ${club.heroCharacter ? "object-bottom [mask-image:linear-gradient(to_bottom,black_72%,transparent_98%)]" : "p-[16%]"}`}
            />
          </div>
        </motion.div>
      </div>

      <a
        href="#advantages"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-rn-muted transition hover:text-white md:flex"
      >
        {t("hero.scroll")}
        <ChevronDown className="h-4 w-4 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-rn-line/80 bg-rn-surface/50 px-2.5 py-3 backdrop-blur sm:p-4">
      <dt className="sr-only">{label}</dt>
      <dd>
        <div className="flex items-center gap-2 font-display text-xl font-bold text-white sm:text-2xl">
          {icon}
          {value}
        </div>
        <div className="mt-1 break-words text-[10px] leading-tight text-rn-muted sm:text-xs sm:uppercase sm:tracking-wider">{label}</div>
      </dd>
    </div>
  );
}
