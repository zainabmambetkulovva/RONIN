"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Плавное появление при прокрутке. Учитывает «уменьшить движение» в системе. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Заголовок секции: подпись, крупный заголовок, подзаголовок. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal className={`mb-8 md:mb-12 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p
        className={`mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-rn-cyan ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-rn-cyan to-rn-magenta" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-rn-muted sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

/** Обёртка секции с якорем и единой шириной контента. */
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-20 py-12 md:py-16 ${className}`}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
