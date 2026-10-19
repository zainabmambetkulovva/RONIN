"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Calendar, Clock, Gamepad2, ArrowRight } from "lucide-react";

export function RoninHero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const heroTexts = [
    t("hero.phrase1"),
    t("hero.phrase2"),
    t("hero.phrase3"),
    t("hero.phrase4"),
    t("hero.phrase5"),
  ];
  
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 7000); // 7 секунд
    return () => clearInterval(interval);
  }, [heroTexts.length, mounted]);
  
  const stats = [
    { value: "96", label: t("stats.computers"), icon: Gamepad2 },
    { value: "240", label: t("stats.monitors"), suffix: "Hz" },
    { value: "4", label: t("stats.categories") },
    { value: "24/7", label: t("stats.work"), icon: Clock },
  ];

  if (!mounted) {
    // Return a simple placeholder to avoid hydration mismatch
    return (
      <section id="hero" className="relative min-h-[80vh] flex items-center overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <div className="space-y-8">
              <div className="h-96" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center overflow-hidden pt-16 pb-24 md:pb-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          {/* LEFT - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
                {t("hero.badge")}
              </span>
            </div>

            {/* Heading with rotating text */}
            <div className="h-24 sm:h-28 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight"
                >
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {heroTexts[currentTextIndex]}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Stats - E PLAY style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-4 rounded-xl text-center hover:scale-105 transition-transform"
                >
                  {stat.icon && <stat.icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />}
                  <div className="text-3xl font-black text-white">
                    {stat.value}
                    {stat.suffix && <span className="text-lg text-purple-400">{stat.suffix}</span>}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  {t("hero.bookButton")}
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.a>

              <motion.a
                href="#computers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-card rounded-xl font-bold text-white uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                {t("hero.aboutButton")}
              </motion.a>
            </div>
          </motion.div>

          {/* RIGHT - Gaming Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] flex items-center justify-center">
              {/* Animated circles */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-purple-500/30" />
              </motion.div>
              
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-pink-500/30" />
              </motion.div>

              {/* Center logo with glow */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <div className="relative w-64 h-64">
                  <Image
                    src="/logo-new.png"
                    alt="RONIN"
                    fill
                    className="object-contain"
                    sizes="256px"
                    style={{
                      filter: "drop-shadow(0 0 40px rgba(168,85,247,0.8)) drop-shadow(0 0 80px rgba(236,72,153,0.6))",
                    }}
                  />
                </div>
              </motion.div>

              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-purple-500"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 3) * 15}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

