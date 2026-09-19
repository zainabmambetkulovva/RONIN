"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru" as const, label: "Русский", flag: "🇷🇺" },
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "kg" as const, label: "Кыргызча", flag: "🇰🇬" },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/5"
        style={{
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-white text-sm font-bold uppercase hidden sm:block">
          {currentLang.code}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.98), rgba(13,13,36,0.98))",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                language === lang.code
                  ? "bg-blue-600/20 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-bold">{lang.label}</span>
              {language === lang.code && (
                <svg
                  className="w-5 h-5 ml-auto text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
