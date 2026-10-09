"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { Locale } from "@/lib/i18n/translations";

const languages = [
  { code: "ru" as Locale, label: "RU", flag: "🇷🇺" },
  { code: "kg" as Locale, label: "KG", flag: "🇰🇬" },
  { code: "en" as Locale, label: "EN", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className="px-3 py-1 rounded-lg text-sm font-bold transition-all hover:scale-110"
          style={{
            background:
              locale === lang.code
                ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                : "rgba(255,255,255,0.1)",
            color: locale === lang.code ? "#fff" : "#9ca3af",
            border:
              locale === lang.code
                ? "2px solid rgba(59,130,246,0.5)"
                : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
