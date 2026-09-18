"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Главная" },
  { href: "#about", label: "О клубе" },
  { href: "#booking-flow", label: "Бронирование" },
  { href: "#computers", label: "Компьютеры" },
  { href: "#games", label: "Игры" },
  { href: "#contacts", label: "Контакты" },
];

export function CyberNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <span
              className="text-2xl font-black tracking-widest"
              style={{
                background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
              }}
            >
              RONIN
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons — ВОЗВРАЩЕНЫ */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Войти
            </a>
            <a
              href="/register"
              className="px-5 py-2 rounded-lg text-sm font-bold text-white uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                boxShadow: "0 0 16px rgba(99,102,241,0.4)",
              }}
            >
              Регистрация
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="md:hidden py-4 space-y-1"
            style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-2 py-2.5 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a href="/login" className="block w-full text-center px-4 py-2 rounded-lg text-sm text-gray-300 border border-blue-500/30">
                Войти
              </a>
              <a href="/register" className="block w-full text-center px-4 py-2 rounded-lg text-sm font-bold text-white uppercase"
                style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)" }}>
                Регистрация
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
