"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const tariffs = [
  {
    name: "Утренний",
    price: "95₸",
    period: "час",
    time: "09:00 — 17:00",
    features: ["Утренние часы", "Скидка -20%"]
  },
  {
    name: "Стандартный",
    price: "120₸",
    period: "час",
    time: "17:00 — 23:00",
    features: ["Стандартное время", "Все ПК"]
  },
  {
    name: "Ночной",
    price: "100₸",
    period: "час",
    time: "23:00 — 09:00",
    features: ["Ночные часы", "Скидка -15%"]
  }
];

export function CyberTariffsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 relative bg-black" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Тарифы
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tariffs.map((tariff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-500/30 hover:border-blue-500/60 transition-all">
                <h3 className="text-2xl font-black text-white mb-2">
                  {tariff.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-black text-blue-400">{tariff.price}</span>
                  <span className="text-gray-400 ml-2">/час</span>
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  {tariff.time}
                </div>

                <div className="space-y-2">
                  {tariff.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  ЗАБРОНИРОВАТЬ
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
