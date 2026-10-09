"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const tariffs = [
  {
    name: "Утренний",
    price: "95с",
    period: "час",
    time: "09:00 — 17:00",
    features: ["Утренние часы", "Скидка -20%"],
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", // dark blue
    borderColor: "rgba(59,130,246,0.3)",
    textColor: "#3b82f6",
  },
  {
    name: "Стандартный",
    price: "120с",
    period: "час",
    time: "17:00 — 23:00",
    features: ["Стандартное время", "Все ПК"],
    gradient: "linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)", // dark purple
    borderColor: "rgba(139,92,246,0.3)",
    textColor: "#8b5cf6",
  },
  {
    name: "Ночной",
    price: "100с",
    period: "час",
    time: "23:00 — 09:00",
    features: ["Ночные часы", "Скидка -15%"],
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)", // blue to purple
    borderColor: "rgba(99,102,241,0.3)",
    textColor: "#6366f1",
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
              <div
                className="p-6 rounded-xl transition-all hover:scale-105"
                style={{
                  background: tariff.gradient,
                  border: `2px solid ${tariff.borderColor}`,
                  boxShadow: `0 0 30px ${tariff.borderColor}`,
                }}
              >
                <h3 className="text-2xl font-black text-white mb-2">
                  {tariff.name}
                </h3>
                
                <div className="mb-4">
                  <span
                    className="text-4xl font-black"
                    style={{ color: tariff.textColor }}
                  >
                    {tariff.price}
                  </span>
                  <span className="text-white ml-2">/час</span>
                </div>

                <div className="text-sm text-white/70 mb-4">
                  {tariff.time}
                </div>

                <div className="space-y-2">
                  {tariff.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white">
                      <svg
                        className="w-4 h-4"
                        style={{ color: tariff.textColor }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full mt-6 px-6 py-3 rounded-lg font-bold text-white transition-all"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "2px solid white",
                    boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(255,255,255,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.3)";
                  }}
                >
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
