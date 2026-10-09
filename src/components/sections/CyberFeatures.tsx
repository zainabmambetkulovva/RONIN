"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Wifi, Zap, Shield, Headphones, Coffee, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Высокая производительность",
    description: "Мощные игровые ПК с RTX 3060 и i7-12700F",
    color: "#60a5fa",
  },
  {
    icon: Wifi,
    title: "Скоростной интернет",
    description: "500 Мбит/с для комфортной игры без лагов",
    color: "#a78bfa",
  },
  {
    icon: Shield,
    title: "Безопасность",
    description: "Контроль доступа и защита личных данных",
    color: "#818cf8",
  },
  {
    icon: Headphones,
    title: "Профессиональное оборудование",
    description: "Игровые мониторы 240Hz и качественный звук",
    color: "#60a5fa",
  },
  {
    icon: Coffee,
    title: "Напитки включены",
    description: "Бесплатный чай, кофе и вода для всех гостей",
    color: "#a78bfa",
  },
  {
    icon: Sparkles,
    title: "Приятная атмосфера",
    description: "Современный дизайн и комфортные кресла",
    color: "#818cf8",
  },
];

export function CyberFeatures() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-24 relative" style={{ background: "#03030a" }} ref={ref}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#60a5fa" }}>
              ПРЕИМУЩЕСТВА
            </span>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #8b5cf6, transparent)" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
            Почему выбирают нас
          </h2>
        </motion.div>

        {/* Grid - жөнөкөй карточкалар */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(13, 11, 42, 0.6) 0%, rgba(7, 6, 26, 0.6) 100%)",
                  border: "2px solid rgba(99, 102, 241, 0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${feature.color}15`,
                    border: `2px solid ${feature.color}`,
                    boxShadow: `0 0 20px ${feature.color}30`,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                
                {/* Hover эффект */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{
                    boxShadow: `inset 0 0 0 2px ${feature.color}40`,
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
