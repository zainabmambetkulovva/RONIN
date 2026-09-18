"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const tariffs = [
  { hours: "1 час", price: 120, popular: false },
  { hours: "3 часа", price: 300, popular: true },
  { hours: "5 часов", price: 500, popular: false },
  { hours: "Night (23:00-7:00)", price: 600, popular: false },
  { hours: "Morning (7:00-12:00)", price: 300, popular: false },
];

export function TariffsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="tariffs" ref={ref} className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ronin-neon/30 bg-ronin-neon/10 mb-6">
            <span className="text-xs font-bold text-ronin-neon uppercase tracking-widest">Тарифы</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="ronin-gradient-text">Выгодные пакеты</span>
          </h2>
          <p className="text-xl text-gray-400">Цены указаны для категории Standard</p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {tariffs.map((tariff, index) => (
            <motion.div
              key={tariff.hours}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 flex items-center justify-between group hover:border-ronin-neon/60 transition-all ${
                tariff.popular ? "border-ronin-neon/60 shadow-neon" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {tariff.popular && (
                  <span className="px-3 py-1 rounded-full bg-ronin-neon/20 border border-ronin-neon/40 text-xs font-bold text-ronin-neon uppercase">
                    Популярный
                  </span>
                )}
                <span className="text-xl font-bold text-white">{tariff.hours}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-3xl font-black ronin-gradient-text">{tariff.price} сом</span>
                <button className="px-6 py-2 rounded-lg font-bold border border-ronin-neon/40 hover:bg-ronin-neon/10 hover:border-ronin-neon transition-all text-sm">
                  Выбрать
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
