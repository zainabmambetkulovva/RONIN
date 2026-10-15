"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { FullPageLoader } from "@/components/ui/RollingLoader";

interface Avatar {
  code: string;
  name?: string; // Optional для обратной совместимости
  imageUrl: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
    fetchAvatars();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      
      if (data.user) {
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          avatar: data.user.avatar || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setErrors({ submit: "Ошибка загрузки профиля" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvatars = async () => {
    try {
      const response = await fetch("/api/avatars");
      if (!response.ok) {
        throw new Error("Failed to fetch avatars");
      }
      const data = await response.json();
      setAvatars(data.avatars || []);
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
      // Set empty avatars to avoid infinite loading
      setAvatars([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (formData.phone && !/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/profile");
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || "Ошибка сохранения" });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrors({ submit: "Ошибка сохранения" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Загрузка..." />;
  }

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
          className="text-center mb-8"
        >
          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(90deg, #10b981, #059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Редактировать профиль
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Измените информацию о себе
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-3xl overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="p-6 sm:p-8 space-y-6">
            {/* Avatar selection */}
            <div>
              <label className="block text-white font-bold mb-4">Выбери персонажа</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: avatar.code })}
                    className={`aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 relative ${
                      formData.avatar === avatar.code ? "ring-4 ring-blue-500" : ""
                    }`}
                    style={{
                      background: formData.avatar === avatar.code 
                        ? "rgba(59,130,246,0.3)" 
                        : "rgba(255,255,255,0.05)",
                      border: `2px solid ${formData.avatar === avatar.code ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <Image 
                      src={avatar.imageUrl} 
                      alt={avatar.code}
                      fill
                      sizes="(max-width: 640px) 25vw, 16vw"
                      quality={100}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Имя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                className="w-full px-4 py-3 rounded-xl text-white font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+996 XXX XXX XXX"
                className="w-full px-4 py-3 rounded-xl text-white font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.phone ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              disabled={saving}
              className="py-4 text-white font-bold uppercase text-sm transition-all hover:bg-white/5 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-4 text-white font-bold uppercase text-sm transition-all hover:bg-green-600/20 disabled:opacity-50"
              style={{
                background: "linear-gradient(90deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </motion.form>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-4 rounded-xl"
          style={{
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <p className="text-gray-400 text-xs text-center">
            Email изменить нельзя. Для изменения email обратитесь к администратору.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
