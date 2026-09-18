"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Cpu, Armchair, Volume2, Rocket } from "lucide-react";

const features = [
  {
    icon: Cpu,
    number: "01",
    title: "МОЩНОСТЬ",
    description: "Мощные игровые компьютеры",
    detail: "RTX • Intel i5/i9 • до 64 GB RAM",
    image: "/images (1).jpg"
  },
  {
    icon: Armchair,
    number: "02",
    title: "КОМФОРТ",
    description: "Игровые кресла • большие мониторы",
    detail: "144-240Hz • продуманное пространство",
    image: "/images (2).jpg"
  },
  {
    icon: Volume2,
    number: "03",
    title: "АТМОСФЕРА",
    description: "Тёмный интерьер • неоновый свет",
    detail: "качественный звук • кибер атмосфера",
    image: "/images (3).jpg"
  },
  {
    icon: Rocket,
    number: "04",
    title: "ТВОЯ СЕССИЯ",
    description: "Выбери компьютер • дату • время",
    detail: "оплати • играй",
    image: "/images (4).jpg"
  }
];

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-gradient-to-b from-ronin-black via-[#0a0a1f] to-ronin-black">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-ronin-neon/10 rounded-full blur-[150px] -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 text-ronin-neon text-sm font-bold mb-6 uppercase tracking-wider">
            ПОЧЕМУ RONIN?
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight"
        >
          <span className="text-white">НЕ ПРОСТО ПК.</span>
          <br />
          <span className="ronin-gradient-text">СВОЁ МЕСТО</span>
          <br />
          <span className="ronin-gradient-text">ДЛЯ ИГРЫ.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-gray-400 text-lg mb-16 max-w-3xl mx-auto"
        >
          RONIN — это современный компьютерный клуб, где технологии, комфорт и атмосфера создают идеальные условия для твоей игры.
        </motion.p>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl border border-ronin-neon/20 bg-gradient-to-br from-ronin-gray/40 to-ronin-black/40 backdrop-blur-md hover:border-ronin-neon/60 transition-all duration-500 h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ronin-black via-ronin-black/80 to-transparent"></div>
                  </div>

                  <div className="relative p-8 flex items-start gap-6">
                    {/* Icon & Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-ronin-neon/10 border border-ronin-neon/40 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-neon-glow transition-all duration-300">
                        <Icon className="w-8 h-8 text-ronin-neon" />
                      </div>
                      <div className="text-6xl font-black text-ronin-neon/20 leading-none">
                        {feature.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-black text-ronin-neon mb-2 tracking-wider">
                        {feature.title}
                      </h3>
                      <p className="text-white font-medium mb-2 text-lg">
                        {feature.description}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {feature.detail}
                      </p>

                      {/* Animated arrow */}
                      <motion.div
                        className="mt-4 flex items-center gap-2 text-ronin-neon opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <span className="text-sm font-bold">УЗНАТЬ БОЛЬШЕ</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Neon glow border on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.3)]"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-ronin-neon font-bold tracking-[0.3em] uppercase">
            БОЛЬШЕ, ЧЕМ ПРОСТО КОМПЬЮТЕРНЫЙ КЛУБ
          </p>
        </motion.div>
      </div>
    </section>
  );
}
