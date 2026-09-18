"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#games", label: "Игры" },
  { href: "#computers", label: "Компьютеры" },
  { href: "#booking", label: "Бронирование" },
  { href: "#about", label: "О клубе" },
  { href: "#contacts", label: "Контакты" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ronin-neon/10 bg-ronin-black/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="RONIN Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-black ronin-gradient-text tracking-wider neon-text">
              RONIN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-ronin-neon text-gray-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 rounded-lg font-medium text-sm text-gray-300 hover:text-white transition-colors border border-ronin-neon/30 hover:border-ronin-neon/60">
              Войти
            </button>
            <button className="px-5 py-2 rounded-lg font-bold bg-neon-glow hover:shadow-neon transition-all text-sm uppercase tracking-wider">
              Регистрация
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-ronin-neon/10 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm text-gray-300 hover:text-ronin-neon"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <button className="block w-full px-4 py-2 rounded-lg font-medium text-sm text-gray-300 border border-ronin-neon/30">
                Войти
              </button>
              <button className="block w-full px-4 py-2 rounded-lg font-bold bg-neon-glow text-sm uppercase">
                Регистрация
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
