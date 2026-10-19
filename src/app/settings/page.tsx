"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Globe, Bell, User } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<"ru" | "kg" | "en">("ru");
  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    promotions: false,
    systemUpdates: true,
  });

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem("language", language);
    localStorage.setItem("notifications", JSON.stringify(notifications));
    alert("Настройки сохранены!");
  };

  const handleLogout = () => {
    // Clear session and redirect to login
    if (confirm("Вы уверены, что хотите выйти?")) {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <MobileMenu />
      {/* Background effects */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Настройки
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Управление параметрами приложения
          </p>
        </motion.div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Language settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Язык</h2>
                <p className="text-gray-400 text-sm">Выберите язык интерфейса</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "ru", label: "Русский", flag: "🇷🇺" },
                { value: "kg", label: "Кыргызча", flag: "🇰🇬" },
                { value: "en", label: "English", flag: "🇬🇧" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value as any)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    language === lang.value ? "ring-2 ring-blue-500" : "hover:bg-white/5"
                  }`}
                  style={{
                    background: language === lang.value ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${language === lang.value ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="text-white text-sm font-bold">{lang.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Notification settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Уведомления</h2>
                <p className="text-gray-400 text-sm">Управление уведомлениями</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "bookingReminders",
                  label: "Напоминания о бронированиях",
                  description: "Получать уведомления перед началом игры",
                },
                {
                  key: "promotions",
                  label: "Акции и скидки",
                  description: "Информация о специальных предложениях",
                },
                {
                  key: "systemUpdates",
                  label: "Системные уведомления",
                  description: "Важные обновления и изменения",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm mb-1">{item.label}</h3>
                    <p className="text-gray-400 text-xs">{item.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]: !notifications[item.key as keyof typeof notifications],
                      })
                    }
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      notifications[item.key as keyof typeof notifications]
                        ? "bg-blue-600"
                        : "bg-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={{
                        x: notifications[item.key as keyof typeof notifications] ? 24 : 2,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Аккаунт</h2>
                <p className="text-gray-400 text-sm">Управление учетной записью</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/profile")}
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:bg-white/5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-white font-medium">Мой профиль</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/setup-profile")}
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:bg-white/5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-white font-medium">Изменить аватар</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:bg-red-500/10"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-red-400 font-bold">Выйти из аккаунта</span>
                </div>
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <button
            onClick={handleSaveSettings}
            className="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            Сохранить изменения
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
            style={{
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
            }}
          >
            Отменить
          </button>
        </motion.div>
      </div>
    </div>
  );
}
