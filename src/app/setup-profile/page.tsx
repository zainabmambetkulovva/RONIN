"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RollingLoader } from "@/components/ui/RollingLoader";

const AVATAR_OPTIONS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function SetupProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Если пользователь уже настроил профиль, перенаправляем на главную
    if (session?.user && !session.user.needsSetup) {
      router.push("/");
    }

    // Предзаполнить имя из Google если есть
    if (session?.user?.name && !name) {
      setName(session.user.name);
    }
  }, [session, router, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim()) {
      setError(t("setup.nameRequired") || "Имя обязательно");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          avatar: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка обновления профиля");
      }

      // Обновить session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name.trim(),
          avatar: selectedAvatar,
          needsSetup: false, // Profile is now complete
        },
      });

      // Перенаправить на главную страницу
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4 text-sm animate-pulse">
            {t("setup.loading") || "Загрузка профиля..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#03030a" }}
    >
      {/* Background effects */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/logo-new.png"
              alt="RONIN Logo"
              fill
              className="object-contain"
              sizes="80px"
              style={{
                filter: "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
              }}
            />
          </div>
          <h1
            className="text-4xl font-black tracking-widest mb-2"
            style={{
              background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
            }}
          >
            {t("setup.welcome") || "Добро пожаловать!"}
          </h1>
          <p className="text-gray-400">
            {t("setup.subtitle") || "Настройте свой профиль"}
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))",
            border: "1px solid rgba(59,130,246,0.2)",
            boxShadow: "0 0 40px rgba(59,130,246,0.15)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="p-4 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                <Camera className="w-4 h-4 inline mr-2" />
                {t("setup.chooseAvatar") || "Выберите аватар"}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 ${
                      selectedAvatar === avatar
                        ? "ring-4 ring-blue-500 scale-105"
                        : "ring-1 ring-white/10"
                    }`}
                    style={{
                      background: "rgba(15,15,30,0.6)",
                    }}
                  >
                    <Image
                      src={avatar}
                      alt={`Avatar ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="360px"
                      quality={92}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t("setup.yourName") || "Ваше имя"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t("setup.namePlaceholder") || "Введите ваше имя"}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                style={{
                  background: "rgba(15,15,30,0.6)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                boxShadow: "0 0 24px rgba(59,130,246,0.5)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("setup.saving") || "Сохранение..."}
                </span>
              ) : (
                t("setup.continue") || "Продолжить"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
