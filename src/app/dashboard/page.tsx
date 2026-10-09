"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotivationalCarousel } from "@/components/dashboard/MotivationalCarousel";
import { PopularGamesSection } from "@/components/dashboard/PopularGamesSection";
import { MobileMenu } from "@/components/layout/MobileMenu";

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <MobileMenu />
      {/* Background effects */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Главная
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Добро пожаловать в RONIN Gaming Club
          </p>
        </motion.div>

        {/* Motivational Carousel */}
        <MotivationalCarousel />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12"
        >
          <QuickActionCard
            icon="🎮"
            title="Забронировать ПК"
            description="Выбери время и компьютер"
            href="/booking"
            gradient="from-blue-600 to-blue-800"
          />
          <QuickActionCard
            icon="📜"
            title="Мои бронирования"
            description="История и активные чеки"
            href="/archive"
            gradient="from-purple-600 to-purple-800"
          />
          <QuickActionCard
            icon="👤"
            title="Профиль"
            description="Настройки и персонаж"
            href="/profile"
            gradient="from-indigo-600 to-indigo-800"
          />
        </motion.div>

        {/* Popular Games Section */}
        <PopularGamesSection />
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  gradient,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
}) {
  return (
    <a
      href={href}
      className="group relative rounded-2xl overflow-hidden p-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        border: "1px solid rgba(59,130,246,0.2)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${gradient}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <svg
          className="w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
      />
    </a>
  );
}
