"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function CyberNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#about", label: t("nav.about") },
    { href: "#tariffs", label: t("nav.tariffs") },
    { href: "#games", label: t("nav.games") },
    { href: "#contacts", label: t("nav.contacts") },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group shrink-0">
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
          <div className="hidden lg:flex items-center gap-8">
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

          {/* Auth Buttons + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <a
              href="/login"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              {t("nav.login")}
            </a>
            <a
              href="/register"
              className="px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-white uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                boxShadow: "0 0 16px rgba(99,102,241,0.4)",
              }}
            >
              {t("nav.register")}
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-gray-300 hover:text-white ml-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu — ТОЛЬКО навигационные ссылки */}
        {isOpen && (
          <div
            className="lg:hidden py-4 space-y-1"
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
          </div>
        )}
      </div>
    </nav>
  );
}
