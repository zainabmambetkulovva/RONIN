"use client";

import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function DashboardNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ky", label: "KG" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Вы точно хотите выйти?");
    if (confirmed) {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a14]/95 backdrop-blur-xl border-b border-purple-500/20"
          : "bg-[#0a0a14]/80 backdrop-blur-md border-b border-purple-500/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-3 group shrink-0">
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as "ru" | "en" | "ky")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    language === lang.code
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Auth buttons / User menu */}
            {session ? (
              <div className="flex items-center gap-2">
                {/* Profile button - убран username */}
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-4 py-1.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Войти
                </a>
                <a
                  href="/register"
                  className="px-5 py-1.5 rounded-lg text-sm font-bold text-white uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Регистрация
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
