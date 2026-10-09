"use client";

import { useState } from "react";
import { Menu, X, Home, Calendar, Archive, Info, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Главный", href: "/dashboard" },
    { icon: Calendar, label: "Забронировать", href: "/book" },
    { icon: Archive, label: "Архив", href: "/archive" },
    { icon: Info, label: "Информация", href: "/info" },
    { icon: User, label: "Профиль", href: "/profile" },
    { icon: Settings, label: "Настройки", href: "/settings" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 z-40 p-6"
              style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", borderLeft: "1px solid rgba(139,92,246,0.3)" }}
            >
              <div className="mt-16 space-y-2">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "#a78bfa" }} />
                      <span className="text-lg font-bold text-white">{item.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
