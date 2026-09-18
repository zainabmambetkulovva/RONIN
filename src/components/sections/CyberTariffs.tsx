"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock } from "lucide-react";

const tariffs = [
  {
    name: "Утренний",
    timeFrom: "09:00",
    timeTo: "13:00",
    price: "95",
    priceUnit: "сом/час",
    label: "Добрый ч...",
    tag: null,
    accent: "#3b82f6",
    bg: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
    border: "rgba(59,130,246,0.35)",
    glow: "rgba(59,130,246,0.15)",
    barWidth: "35%",
  },
  {
    name: "Стандартный",
    timeFrom: "13:00",
    timeTo: "23:00",
    price: "120",
    priceUnit: "сом/час",
    label: "Стан...",
    tag: "ПОПУЛЯРНЫЙ",
    accent: "#6366f1",
    bg: "linear-gradient(135deg, #0d0a2e 0%, #09071f 100%)",
    border: "rgba(99,102,241,0.5)",
    glow: "rgba(99,102,241,0.2)",
    barWidth: "65%",
  },
  {
    name: "Ночной",
    timeFrom: "23:00",
    timeTo: "09:00",
    price: "100",
    priceUnit: "сом/час",
    label: "Ночн..",
    tag: null,
    accent: "#8b5cf6",
    bg: "linear-gradient(135deg, #10082e 0%, #08051a 100%)",
    border: "rgba(139,92,246,0.35)",
    glow: "rgba(139,92,246,0.15)",
    barWidth: "45%",
  },
];

export function CyberTariffs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="tariffs" className="py-20 relative" style={{ background: "#05050f" }} ref={ref}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-black text-white mb-10"
        >
          Тарифы
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {tariffs.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative rounded-xl p-6 border overflow-hidden group"
              style={{
                background: t.bg,
                borderColor: t.border,
                boxShadow: `0 0 30px ${t.glow}`,
              }}
            >
              {/* Popular tag */}
              {t.tag && (
                <div
                  className="absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(99,102,241,0.2)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    color: "#a5b4fc",
                  }}
                >
                  {t.tag}
                </div>
              )}

              {/* Name */}
              <h3 className="text-2xl font-black text-white mb-3">{t.name}</h3>

              {/* Time row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: t.accent }} />
                  {t.timeFrom}
                </div>
                <span className="text-gray-500 text-xs">—</span>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: t.accent }} />
                  {t.timeTo}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span
                  className="text-4xl font-black"
                  style={{ color: t.accent, filter: `drop-shadow(0 0 8px ${t.accent})` }}
                >
                  {t.price}
                </span>
                <span className="text-gray-400 text-sm ml-2">{t.priceUnit}</span>
              </div>

              {/* Progress bar */}
              <div
                className="h-1 rounded-full mb-4 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: t.barWidth } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }}
                />
              </div>

              <p className="text-gray-400 text-xs">{t.label}</p>

              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ boxShadow: `inset 0 0 30px ${t.glow}` }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="#contacts"
            className="inline-block px-12 py-3.5 rounded font-black uppercase tracking-wider text-white text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "0 0 28px rgba(99,102,241,0.4)",
            }}
          >
            Забронировать
          </a>
        </motion.div>
      </div>
    </section>
  );
}
