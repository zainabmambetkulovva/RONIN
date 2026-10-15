"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export function RoninBookingFlowCompact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t } = useLanguage();
  const [glowingIndex, setGlowingIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Glow effect every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowingIndex((prev) => (prev + 1) % 6);
    }, 2000);  // 2 seconds
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { num: "01", titleKey: "booking.step1.title", descKey: "booking.step1.desc" },
    { num: "02", titleKey: "booking.step2.title", descKey: "booking.step2.desc" },
    { num: "03", titleKey: "booking.step3.title", descKey: "booking.step3.desc" },
    { num: "04", titleKey: "booking.step4.title", descKey: "booking.step4.desc" },
    { num: "05", titleKey: "booking.step5.title", descKey: "booking.step5.desc" },
    { num: "06", titleKey: "booking.step6.title", descKey: "booking.step6.desc" },
  ];

  if (!mounted) return null;

  return (
    <section 
      id="booking-flow" 
      className="py-16 relative overflow-hidden" 
      ref={ref}
    >
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tag + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              {t("booking.badge")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-2">
            {t("booking.title")}
          </h2>
        </motion.div>

        {/* Steps grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className={`relative p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 transition-all duration-500 group ${
                glowingIndex === i 
                  ? 'border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)]' 
                  : 'border border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              {/* Number */}
              <div className="absolute top-4 right-4 text-5xl font-black text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                {step.num}
              </div>

              {/* Number badge */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-lg">{step.num}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-black text-white mb-2 group-hover:text-purple-400 transition-colors">
                {t(step.titleKey)}
              </h3>
              <p className="text-sm text-gray-400">
                {t(step.descKey)}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
