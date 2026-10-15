"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ky", label: "KG" },
  ];

  return (
    <div className="flex items-center gap-1 border border-blue-500/20 rounded-lg p-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as "ru" | "en" | "ky")}
          className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-all ${
            language === lang.code
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
