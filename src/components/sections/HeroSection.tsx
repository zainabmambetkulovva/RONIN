"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images%20(3).jpg)',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ronin-black/60 via-ronin-black/70 to-ronin-black/90" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 rounded-full bg-ronin-neon opacity-10 blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-ronin-purple opacity-10 blur-3xl"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ronin-neon/30 bg-ronin-neon/10 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-ronin-neon animate-pulse" />
            <span className="text-sm font-medium text-ronin-neon uppercase tracking-widest">
              Бишкек · Кыргызстан
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
          >
            <span className="inline-block ronin-gradient-text neon-text">
              RONIN
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Компьютерный клуб в Бишкеке
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Мощные игровые ПК • Комфортная атмосфера • Лучшие тарифы
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/register"
              className="group relative px-8 py-4 bg-neon-glow rounded-xl font-bold text-lg uppercase tracking-wider overflow-hidden transition-all hover:shadow-neon-blue hover:scale-105"
            >
              <span className="relative z-10">Забронировать</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ronin-neon to-ronin-blue-neon opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="#computers"
              className="px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider border-2 border-ronin-neon/40 hover:border-ronin-neon hover:bg-ronin-neon/10 transition-all"
            >
              Наши компьютеры
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-xs uppercase tracking-widest">Узнать больше</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
