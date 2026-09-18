"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Monitor, Wifi, Cpu, Zap } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Высококачественное содержание",
    desc: "Мониторы 144–240 Гц, профессиональные игровые периферии, идеальное изображение.",
  },
  {
    icon: Wifi,
    title: "Беспроводное оборудование",
    desc: "Высокоскоростной интернет, беспроводные гарнитуры и мыши без задержек.",
  },
  {
    icon: Cpu,
    title: "Ядра для любых задач",
    desc: "Intel Core i5–i9, до 64 ГБ RAM, RTX серии — для любой современной игры.",
  },
  {
    icon: Zap,
    title: "Мощная система вентиляции",
    desc: "Климат-контроль и тихая система охлаждения обеспечивают комфорт в любое время года.",
  },
];

export function CyberAboutFeatures() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-20 relative" style={{ background: "#05050f" }} ref={ref}>
      {/* Subtle top divider glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
            <span className="text-white">Мы пространство для </span>
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #fb923c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              настоящих{" "}
            </span>
            <span className="text-white">ценителей </span>
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #fb923c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              игрового мира
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm max-w-2xl">
            Наше заведение оборудовано последними технологиями для комфортной игры и работы.
            Профессиональная техника и уютная атмосфера создают идеальные условия.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-xl p-6 border border-indigo-500/25 hover:border-indigo-500/55 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #0d0b1f 0%, #0a0818 100%)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#818cf8" }} />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-sm mb-2 leading-snug">{f.title}</h3>

                {/* Desc */}
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
