"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");
  const { language, setLanguage } = useLanguage();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
        <p className="text-gray-400">Управление параметрами системы</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Уведомления */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Уведомления</h2>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-white font-medium mb-1">Push-уведомления</div>
              <div className="text-sm text-gray-400">
                Получать уведомления о новых бронированиях
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative w-14 h-7 rounded-full transition-colors"
              style={{
                background: notifications
                  ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                  : "rgba(100,100,120,0.3)",
              }}
            >
              <div
                className="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-lg"
                style={{
                  transform: notifications ? "translateX(30px)" : "translateX(4px)",
                }}
              />
            </button>
          </div>

          <div className="border-t mt-3 pt-3" style={{ borderColor: "rgba(59,130,246,0.1)" }}>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-white font-medium mb-1">Email-уведомления</div>
                <div className="text-sm text-gray-400">
                  Получать ежедневные отчеты на почту
                </div>
              </div>
              <button
                className="relative w-14 h-7 rounded-full transition-colors"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                }}
              >
                <div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-lg"
                  style={{ transform: "translateX(30px)" }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Язык */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Язык интерфейса</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: "ru", label: "Русский", flag: "🇷🇺" },
              { code: "kg", label: "Кыргызча", flag: "🇰🇬" },
              { code: "en", label: "English", flag: "🇺🇸" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as "ru" | "en" | "kg")}
                className="p-4 rounded-lg transition-all hover:scale-105"
                style={{
                  background:
                    language === lang.code
                      ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                      : "rgba(15,15,30,0.6)",
                  border:
                    language === lang.code
                      ? "2px solid rgba(59,130,246,0.5)"
                      : "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-white font-bold text-sm">{lang.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Тема */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Тема оформления</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "dark",
                label: "Темная",
                icon: "🌙",
                gradient: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
              },
              {
                value: "light",
                label: "Светлая",
                icon: "☀️",
                gradient: "linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)",
              },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className="p-6 rounded-lg transition-all hover:scale-105"
                style={{
                  background:
                    theme === t.value
                      ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                      : "rgba(15,15,30,0.6)",
                  border:
                    theme === t.value
                      ? "2px solid rgba(59,130,246,0.5)"
                      : "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <div className="text-4xl mb-3">{t.icon}</div>
                <div className="text-white font-bold">{t.label}</div>
                <div
                  className="mt-3 h-8 rounded"
                  style={{ background: t.gradient }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Сохранить */}
        <button
          className="w-full py-4 rounded-lg font-black text-white text-lg transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            boxShadow: "0 0 30px rgba(59,130,246,0.5)",
          }}
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
