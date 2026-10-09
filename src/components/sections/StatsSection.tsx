"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { value: "96", label: "Компьютеров", suffix: "" },
  { value: "24", label: "Часа в сутки", suffix: "/7" },
  { value: "120", label: "Сом в час", suffix: "с" },
  { value: "4", label: "Категории ПК", suffix: "" },
];

export function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ronin-purple/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 text-center group hover:border-ronin-neon/40 transition-all duration-300"
            >
              <div className="text-5xl md:text-6xl font-black mb-3">
                <span className="ronin-gradient-text neon-text">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-ronin-neon/60 text-4xl">{stat.suffix}</span>
                )}
              </div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                {stat.label}
              </div>
              
              {/* Bottom neon line */}
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-ronin-neon to-transparent transition-all duration-500 mx-auto mt-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
