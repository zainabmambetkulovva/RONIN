"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { CpuIcon, ArmchairIcon, VolumeIcon, RocketIcon } from "@/components/ui/icons";

const features = [
  {
    num: "01",
    icon: CpuIcon,
    title: "МОЩНОСТЬ",
    desc1: "Мощные игровые компьютеры",
    desc2: "RTX • Intel i5/i9 • до 64 GB RAM",
    image: "/images (1).jpg",
    label: ["GEFORCE", "RTX"],
    accent: "#3b82f6",
  },
  {
    num: "02",
    icon: ArmchairIcon,
    title: "КОМФОРТ",
    desc1: "Игровые кресла • большие мониторы",
    desc2: "144–240Hz • продуманное пространство",
    image: "/images (2).jpg",
    label: ["RONIN"],
    accent: "#60a5fa",
  },
  {
    num: "03",
    icon: VolumeIcon,
    title: "АТМОСФЕРА",
    desc1: "Тёмный интерьер • неоновый свет",
    desc2: "качественный звук • кибер атмосфера",
    image: "/images (4).jpg",
    label: ["RONIN"],
    accent: "#818cf8",
  },
  {
    num: "04",
    icon: RocketIcon,
    title: "ТВОЯ СЕССИЯ",
    desc1: "Выбери компьютер • дату • время",
    desc2: "оплати онлайн • приходи • играй",
    image: "/images (3).jpg",
    label: ["Бронирование"],
    accent: "#a78bfa",
  },
];

export function RoninAbout() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      id="about"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#03030a" }}
      ref={ref}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="h-px w-8 sm:w-10" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em]" style={{ color: "#60a5fa" }}>
                Почему RONIN?
              </span>
            </div>
            <h2
              className="font-black uppercase leading-[0.9] tracking-tighter"
              style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)" }}
            >
              <span className="block text-white">НЕ ПРОСТО ПК.</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                СВОЁ МЕСТО
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ДЛЯ ИГРЫ.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-left lg:text-right"
          >
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#60a5fa" }}>
              Компьютерный клуб
            </span>
            <div className="h-px w-20 sm:w-28 lg:ml-auto mt-2" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5))" }} />
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-10 sm:mb-14"
        >
          96 топовых игровых станций от Standard до VIP. 
          Intel i9, RTX 4090, 240Hz мониторы, профессиональные кресла. 
          Круглосуточная работа, онлайн-бронирование, 4 тарифа на выбор.
        </motion.p>

        {/* Feature rows — вертикальные на мобилке */}
        <div className="space-y-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 * i }}
                className="card-sweep group relative rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(90deg, #07071a 0%, #0d0d24 100%)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  minHeight: "100px",
                }}
              >
                {/* Left content */}
                <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 py-5 sm:py-6 flex-1 min-w-0">
                  <span
                    className="text-3xl sm:text-5xl font-black shrink-0 leading-none select-none"
                    style={{ color: "rgba(59,130,246,0.10)" }}
                  >
                    {f.num}
                  </span>

                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `${f.accent}18`,
                      border: `1px solid ${f.accent}44`,
                    }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: f.accent }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-black text-base sm:text-xl tracking-wider mb-0.5 sm:mb-1">
                      {f.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium">{f.desc1}</p>
                    <p className="text-gray-500 text-[0.65rem] sm:text-xs">{f.desc2}</p>
                  </div>
                </div>

                {/* Arrow — скрыт на мобилке */}
                <div className="hidden md:flex px-6 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="w-5 h-5" style={{ color: f.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>

                {/* Right photo — скрыто на мобилке */}
                <div className="hidden md:block relative shrink-0 overflow-hidden" style={{ width: "300px", height: "100px" }}>
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    className="object-cover opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                    sizes="300px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, #07071a 0%, transparent 45%)" }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                    {f.label.map((w) => (
                      <div
                        key={w}
                        className="text-xs font-black tracking-[0.2em] leading-loose"
                        style={{ color: `${f.accent}66` }}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl"
                  style={{ background: `linear-gradient(to bottom, transparent, ${f.accent}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 sm:mt-14"
        >
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]" style={{ color: "rgba(96,165,250,0.5)" }}>
            Больше, чем просто компьютерный клуб
          </span>
        </motion.div>
      </div>
    </section>
  );
}
