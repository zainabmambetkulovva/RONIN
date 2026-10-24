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
    <div className="flex items-center gap-0.5 rounded-full border border-rn-line bg-rn-surface/60 p-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as "ru" | "en" | "ky")}
          aria-pressed={language === lang.code}
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase transition-all ${
            language === lang.code
              ? "bg-gradient-to-r from-rn-violet to-rn-magenta text-white shadow-[0_0_14px_rgba(217,70,239,0.4)]"
              : "text-rn-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
