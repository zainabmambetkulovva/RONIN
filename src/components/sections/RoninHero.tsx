"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "96", label: "КОМПЬЮТЕРОВ" },
  { value: "144–240", label: "HZ МОНИТОРЫ" },
  { value: "4", label: "КАТЕГОРИИ ПК" },
  { value: "24/7", label: "МЫ РАБОТАЕМ" },
];

export function RoninHero() {
  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden"
      style={{ background: "#03030a", minHeight: "100svh" }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images (5).jpg"
          alt="RONIN Gaming Club"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          style={{ filter: "blur(2px)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(3,3,10,0.90) 0%, rgba(3,3,10,0.75) 50%, rgba(3,3,10,0.40) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, #03030a 0%, transparent 100%)" }}
        />
      </div>

      {/* Glows */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 60%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20">
        <div className="py-16 sm:py-24 md:py-36">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-10" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]" style={{ color: "#60a5fa" }}>
              Почему RONIN?
            </span>
          </motion.div>

          {/* Main heading — адаптивный */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <h1
              className="font-black leading-[0.88] tracking-tighter uppercase"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 9rem)",
                fontStretch: "expanded",
              }}
            >
              <span className="block text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">
                НЕ ПРОСТО ПК.
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #818cf8 60%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 40px rgba(59,130,246,0.55))",
                }}
              >
                СВОЁ МЕСТО
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #818cf8 60%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 40px rgba(59,130,246,0.55))",
                }}
              >
                ДЛЯ ИГРЫ.
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-8 sm:mb-12 font-medium"
          >
            RONIN — современный компьютерный клуб,
            где технологии, комфорт и атмосфера создают
            идеальные условия для твоей игры.
          </motion.p>

          {/* Stats — адаптивная сетка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:gap-10 mb-8 sm:mb-12"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className="font-black leading-none"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    color: i === 3 ? "#a78bfa" : "#60a5fa",
                    filter: `drop-shadow(0 0 14px ${i === 3 ? "rgba(167,139,250,0.7)" : "rgba(96,165,250,0.7)"})`,
                  }}
                >
                  {s.value}
                </span>
                <span className="text-gray-300 text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest mt-1 sm:mt-1.5">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons — адаптивные */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
          >
            <a
              href="#booking-flow"
              className="card-sweep inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] text-sm sm:text-base"
              style={{
                background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
                boxShadow: "0 0 30px rgba(99,102,241,0.45)",
              }}
            >
              Забронировать ПК
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#about"
              className="card-sweep inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:text-white hover:bg-blue-500/10 text-sm sm:text-base"
              style={{
                border: "1px solid rgba(59,130,246,0.45)",
                background: "rgba(59,130,246,0.07)",
              }}
            >
              О клубе
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-400 text-xs uppercase tracking-widest">Листай вниз</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(96,165,250,0.8), transparent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
