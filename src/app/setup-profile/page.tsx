"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FullPageLoader } from "@/components/ui/RollingLoader";

interface Avatar {
  id: string;
  code: string;
  name?: string; // Optional
  imageUrl: string;
  isActive: boolean;
}

export default function SetupProfilePage() {
  const router = useRouter();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const response = await fetch("/api/avatars");
      const data = await response.json();
      setAvatars(data.avatars || []);
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;

    setSaving(true);
    try {
      const response = await fetch("/api/user/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarCode: selectedAvatar }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to save avatar:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Загрузка персонажей..." />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#03030a" }}>
      {/* Background effects */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#60a5fa" }}>
              Шаг 1 из 1
            </span>
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
          </div>

          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Выбери персонажа
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
            Выбери аватар, который будет отображаться в твоем профиле. Ты сможешь изменить его позже в настройках.
          </p>
        </motion.div>

        {/* Avatar grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-10"
        >
          {avatars.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedAvatar(avatar.code)}
              className={`relative group rounded-2xl overflow-hidden transition-all duration-300 aspect-square ${
                selectedAvatar === avatar.code
                  ? "ring-4 ring-blue-500 scale-105"
                  : "ring-1 ring-white/10 hover:ring-blue-400/50 hover:scale-105"
              }`}
              style={{
                background: selectedAvatar === avatar.code
                  ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              }}
            >
              {/* Avatar image */}
              <div className="w-full h-full relative">
                <img 
                  src={avatar.imageUrl} 
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Selected checkmark */}
              {selectedAvatar === avatar.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleSaveAvatar}
            disabled={!selectedAvatar || saving}
            className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all text-sm sm:text-base ${
              !selectedAvatar || saving
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
            }`}
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Сохранение...
              </span>
            ) : (
              "Продолжить"
            )}
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-500/10 text-sm sm:text-base"
            style={{
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
            }}
          >
            Пропустить
          </button>
        </motion.div>
      </div>
    </div>
  );
}
