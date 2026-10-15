"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { FullPageLoader } from "@/components/ui/RollingLoader";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
}

interface Avatar {
  code: string;
  name?: string; // Optional для обратной совместимости
  imageUrl: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Fetch user profile
      const userResponse = await fetch("/api/user/profile");
      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch avatar details if user has one
      if (userData.user?.avatar) {
        const avatarsResponse = await fetch("/api/avatars");
        const avatarsData = await avatarsResponse.json();
        const userAvatar = avatarsData.avatars?.find(
          (a: Avatar) => a.code === userData.user.avatar
        );
        setAvatar(userAvatar || null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarGradient = (avatarCode: string | null) => {
    if (!avatarCode) return "linear-gradient(135deg, #3b82f6, #8b5cf6)";
    
    const num = parseInt(avatarCode.replace("avatar", "")) || 1;
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)", // Blue to purple
      "linear-gradient(135deg, #06b6d4, #3b82f6)", // Cyan to blue
      "linear-gradient(135deg, #8b5cf6, #ec4899)", // Purple to pink
      "linear-gradient(135deg, #10b981, #06b6d4)", // Green to cyan
      "linear-gradient(135deg, #f59e0b, #ef4444)", // Orange to red
    ];
    return gradients[num % gradients.length];
  };

  if (loading) {
    return <FullPageLoader text="Загрузка профиля..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Профиль не найден</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const registrationDate = new Date(user.createdAt);
  const memberDays = Math.floor((Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <DashboardNavbar />
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Назад</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
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
            Профиль
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Информация о твоем аккаунте
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="p-8 sm:p-10">
            {/* Avatar section */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative mb-4"
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black"
                  style={{
                    background: getAvatarGradient(user.avatar),
                    boxShadow: "0 0 60px rgba(59,130,246,0.5)",
                  }}
                >
                  {avatar ? user.name.charAt(0) : user.name.charAt(0)}
                </div>
                {/* Edit avatar button */}
                <button
                  onClick={() => router.push("/setup-profile")}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
                  style={{ boxShadow: "0 0 20px rgba(59,130,246,0.6)" }}
                  title="Изменить аватар"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </motion.div>
            </div>

            {/* User info */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Имя</label>
                <div className="relative group">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 pr-12 transition-all group-hover:border-blue-400/50">
                    <p className="text-white font-bold text-lg">{user.name}</p>
                  </div>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    title="Редактировать имя"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <div className="relative group">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 pr-12 transition-all group-hover:border-blue-400/50">
                    <p className="text-white font-medium">
                      {user.email || <span className="text-gray-500">Не указан</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    title="Редактировать email"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                <div className="relative group">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 pr-12 transition-all group-hover:border-blue-400/50">
                    <p className="text-white font-medium">
                      {user.phone || <span className="text-gray-500">Не указан</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    title="Редактировать телефон"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Дата регистрации</label>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white font-medium">
                    {registrationDate.toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-xl text-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                <p className="text-3xl font-black text-blue-400 mb-1">{memberDays}</p>
                <p className="text-gray-400 text-sm">дней с нами</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: "rgba(139,92,246,0.1)" }}>
                <p className="text-3xl font-black text-purple-400 mb-1">0</p>
                <p className="text-gray-400 text-sm">всего игр</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/profile/edit")}
            className="py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #10b981, #059669)",
              boxShadow: "0 0 30px rgba(16,185,129,0.3)",
            }}
          >
            Редактировать
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            Настройки
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
            style={{
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
            }}
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
