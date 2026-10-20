"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUp } from "lucide-react";
import Image from "next/image";

export function CyberFooter() {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;
  
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-950 to-black dark:from-gray-950 dark:to-black light:from-gray-50 light:to-white border-t border-blue-500/10 dark:border-blue-500/10 light:border-purple-200/30">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 sm:bottom-24 right-6 z-[65] p-4 rounded-full transition-all hover:scale-110 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            boxShadow: "0 0 30px rgba(59,130,246,0.5)",
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </button>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/30 dark:via-purple-600/30 light:via-purple-400/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Brand + Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-new.png"
                  alt="RONIN Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                RONIN
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-gray-900 font-bold text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5">
              {[
                { href: "#hero", label: "Home" },
                { href: "#about", label: t("nav.about") },
                { href: "#computers", label: t("nav.computers") },
                { href: "#games", label: t("nav.games") },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-gray-900 font-bold text-xs uppercase tracking-wider">Support</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#booking-flow" className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors inline-block">
                  {t("nav.booking")}
                </a>
              </li>
              <li>
                <a href="#contacts" className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/login" className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors inline-block">
                  {t("nav.login")}
                </a>
              </li>
              <li>
                <a href="/register" className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors inline-block">
                  {t("nav.register")}
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us - Иконки 36x36px */}
          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-gray-900 font-bold text-xs uppercase tracking-wider">Мы в соцсетях</h4>
            <ul className="example-2">
              {/* Telegram */}
              <li className="icon-content">
                <a
                  href="https://t.me/ronin_support"
                  aria-label="Telegram"
                  data-social="telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="filled"></div>
                  <svg version="1.1" viewBox="0 0 100 100">
                    <path
                      d="M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5  c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2  c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9  c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2  c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z M30,58.3l47.7-31.6  c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2-0.1c-0.1,0.1-0.2,0.4-0.4,0.6L66,38.1  c-8.4,7.7-19.4,17.8-26.7,24.4c0,0,0,0,0,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0.1,0,0.1-0.1,0.2c0,0,0,0.1,0,0.1  c0,0,0,0,0,0.1c-0.5,5.6-1.4,15.2-1.8,19.5c0,0,0,0,0-0.1C36.8,81.4,31.2,62.3,30,58.3z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <div className="tooltip">Telegram</div>
              </li>
              {/* WhatsApp */}
              <li className="icon-content">
                <a
                  href="https://wa.me/996501004700"
                  aria-label="WhatsApp"
                  data-social="whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="filled"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                  </svg>
                </a>
                <div className="tooltip">WhatsApp</div>
              </li>
              {/* TikTok */}
              <li className="icon-content">
                <a
                  href="https://www.tiktok.com/@ronin_kg"
                  aria-label="TikTok"
                  data-social="tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="filled"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="currentColor"/>
                  </svg>
                </a>
                <div className="tooltip">TikTok</div>
              </li>
              {/* Instagram */}
              <li className="icon-content">
                <a
                  href="https://www.instagram.com/ronin__kg"
                  aria-label="Instagram"
                  data-social="instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="filled"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                  </svg>
                </a>
                <div className="tooltip">Instagram</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - Компактный дизайн */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-blue-500/10 dark:border-blue-500/10 light:border-purple-200/30">
          <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600">
            © 2025 RONIN. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 light:text-gray-600">
            <a href="#" className="hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-purple-600 transition-colors">Terms & Conditions</a>
            <span>•</span>
            <span>{t("footer.location")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
