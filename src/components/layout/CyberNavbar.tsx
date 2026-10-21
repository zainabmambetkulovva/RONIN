"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/hooks/useSession";

export function CyberNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  // Hydration fix - wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "#hero", label: "HOME", id: "hero", key: "nav.home" },
    { href: "#games", label: "ИГРЫ", id: "games", key: "nav.games" },
    { href: "#tariffs", label: "ТАРИФЫ", id: "tariffs", key: "nav.tariffs" },
    { href: "#booking-flow", label: "БРОНЬ", id: "booking-flow", key: "nav.booking" },
    { href: "#contacts", label: "КОНТАКТЫ", id: "contacts", key: "nav.contacts" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver для активной секции
  useEffect(() => {
    if (!mounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      }
    );

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [mounted]);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/95 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-new.png"
                  alt="RONIN Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                  priority
                />
              </div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                RONIN
              </span>
            </a>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1a0b2e]/95 backdrop-blur-xl border-b border-purple-500/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo-new.png"
                alt="RONIN Logo"
                fill
                className="object-contain"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              RONIN
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                  activeSection === link.id
                    ? "text-white bg-purple-600"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t(link.key) || link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* User profile - для авторизованных */}
            {session && (
              <a
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || 'User'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-xs font-bold text-white">
                  {session.user?.name}
                </span>
              </a>
            )}
            
            {/* Auth buttons - только для неавторизованных */}
            {!session && (
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {t("nav.login") || "Вход"}
                </a>
                <a
                  href="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  {t("nav.register") || "Регистрация"}
                </a>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-gray-400 hover:text-white ml-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-purple-500/20">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-xs font-bold transition-colors rounded-lg ${
                  activeSection === link.id
                    ? "text-white bg-purple-600"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t(link.key) || link.label}
              </a>
            ))}
            
            {/* Mobile auth/profile - зависит от статуса авторизации */}
            {session ? (
              <div className="pt-4 border-t border-purple-500/20 mt-4">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-white">
                    {session.user?.name || 'Профиль'}
                  </span>
                </a>
              </div>
            ) : (
              <div className="pt-4 space-y-2 border-t border-purple-500/20 mt-4">
                <a
                  href="/login"
                  className="block px-3 py-2 text-xs font-bold text-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.login") || "Вход"}
                </a>
                <a
                  href="/register"
                  className="block px-4 py-2 rounded-lg text-xs font-bold text-white text-center uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.register") || "Регистрация"}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
