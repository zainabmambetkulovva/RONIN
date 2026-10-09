"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: "🏠",
      label: "Главная",
      href: "/dashboard",
      description: "Главная страница",
    },
    {
      icon: "🎮",
      label: "Забронировать",
      href: "/booking",
      description: "Создать бронирование",
    },
    {
      icon: "📜",
      label: "Архив",
      href: "/archive",
      description: "История бронирований",
    },
    {
      icon: "ℹ️",
      label: "Информация",
      href: "/",
      description: "О компьютерном клубе",
    },
    {
      icon: "👤",
      label: "Профиль",
      href: "/profile",
      description: "Мой профиль",
    },
    {
      icon: "⚙️",
      label: "Настройки",
      href: "/settings",
      description: "Настройки приложения",
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Burger button - fixed position */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-[6px] transition-all duration-300 hover:scale-110"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: isOpen
            ? "0 0 30px rgba(239,68,68,0.4)"
            : "0 0 30px rgba(59,130,246,0.4)",
        }}
      >
        <motion.div
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 7 : 0,
            width: isOpen ? "100%" : "70%",
          }}
          transition={{ duration: 0.5 }}
          className="h-[3px] bg-white rounded-full"
          style={{ width: "70%" }}
        />
        <motion.div
          animate={{
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="h-[3px] w-full bg-white rounded-full"
        />
        <motion.div
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -7 : 0,
            width: isOpen ? "100%" : "70%",
          }}
          transition={{ duration: 0.5 }}
          className="h-[3px] bg-white rounded-full"
          style={{ width: "70%" }}
        />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(3,3,10,0.8)", backdropFilter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>

      {/* Menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-40 overflow-y-auto"
            style={{
              background: "linear-gradient(135deg, #0a0a1a 0%, #05050f 100%)",
              borderLeft: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                >
                  <span className="text-white font-black text-xl">R</span>
                </div>
                <div>
                  <h2
                    className="text-xl font-black tracking-wider"
                    style={{
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    RONIN
                  </h2>
                  <p className="text-gray-400 text-[10px]">Gaming Club</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 mb-4" />

            {/* Menu items */}
            <nav className="px-4 pb-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleNavigate(item.href)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                        isActive
                          ? "scale-105"
                          : "hover:bg-white/5"
                      }`}
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))"
                          : "transparent",
                        border: isActive
                          ? "1px solid rgba(59,130,246,0.5)"
                          : "1px solid rgba(59,130,246,0.1)",
                      }}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                          isActive ? "scale-110" : ""
                        }`}
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                            : "rgba(59,130,246,0.1)",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-white font-bold text-sm mb-0.5">{item.label}</h3>
                        <p className="text-gray-400 text-[10px]">{item.description}</p>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-blue-400"
                          style={{ boxShadow: "0 0 10px rgba(59,130,246,0.8)" }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>© 2025 RONIN</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
