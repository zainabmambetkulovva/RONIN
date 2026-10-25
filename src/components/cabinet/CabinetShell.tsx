"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

/** Общая оболочка страниц личного кабинета: шапка, фон, нижняя навигация на телефоне. */
export function CabinetShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-clip bg-rn-void text-white">
        <div className="pointer-events-none fixed inset-0 -z-0" aria-hidden>
          <div className="absolute -left-40 -top-20 h-[460px] w-[460px] rounded-full bg-rn-violet/15 blur-[130px]" />
          <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-rn-magenta/10 blur-[130px]" />
          <div className="rn-grid-bg absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
        </div>
        <CyberNavbar />
        <main className={`relative mx-auto px-4 pb-28 pt-24 sm:px-6 md:pb-16 lg:px-8 lg:pt-28 ${wide ? "max-w-7xl" : "max-w-5xl"}`}>
          {children}
        </main>
        <BottomNav />
        <AIChatWidget />
      </div>
    </MotionConfig>
  );
}

/** Заголовок страницы кабинета. */
export function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-rn-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-rn-cyan to-rn-magenta" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-rn-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Карточка-поверхность кабинета. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-rn-line bg-rn-surface/80 p-5 backdrop-blur sm:p-6 ${className}`}>{children}</div>;
}
