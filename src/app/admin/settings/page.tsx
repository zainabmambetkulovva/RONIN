"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  const changeLanguage = (lng: "ru" | "en" | "ky") => {
    setLanguage(lng);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your admin panel preferences</p>
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
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-white font-medium mb-1">Push Notifications</div>
              <div className="text-sm text-gray-400">
                Receive push notifications about new bookings
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
                <div className="text-white font-medium mb-1">Email Notifications</div>
                <div className="text-sm text-gray-400">
                  Receive email notifications about system updates
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
          <h2 className="text-xl font-bold text-white mb-4">Interface Language</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: "ru", label: "Русский", flag: "🇷🇺" },
              { code: "ky", label: "Кыргызча", flag: "🇰🇬" },
              { code: "en", label: "English", flag: "🇺🇸" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
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
                <div className="text-3xl mb-2 font-bold">{lang.flag}</div>
                <div className="text-white font-bold text-sm">{lang.label}</div>
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
