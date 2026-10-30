"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<"credentials" | "telegram">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionToken, setSessionToken] = useState("");


  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error || "Неверный email или пароль");
      }

      // Сохраняем временный токен
      if (!data.sessionToken) {
        throw new Error('Session token отсутствует в ответе');
      }
      
      setSessionToken(data.sessionToken);
      
      // Небольшая задержка для обновления состояния
      setTimeout(() => {
        setStep("telegram");
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sessionToken) {
      setError("Сессия истекла. Пожалуйста, войдите заново.");
      setStep("credentials");
      return;
    }

    if (code.length !== 6) {
      setError("Код должен содержать 6 цифр");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Неверный код");
      }

      // Сессия установлена сервером в httpOnly cookie
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#03030a" }}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase mb-2">
            {step === "credentials" ? "Вход в админ панель" : "Проверка безопасности"}
          </h1>
          <p className="text-gray-400 text-sm">
            {step === "credentials" ? "Введите email и пароль администратора" : "Введите код из Telegram"}
          </p>
        </div>

        {/* Form Container */}
        <div
          className="rounded-3xl p-8 backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, rgba(13, 11, 42, 0.8) 0%, rgba(7, 6, 26, 0.8) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleCredentialsSubmit}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-white transition-all"
                      style={{
                        background: "rgba(15, 15, 30, 0.8)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                      }}
                      placeholder="admin@ronin.kg"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-white transition-all"
                      style={{
                        background: "rgba(15, 15, 30, 0.8)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-black text-white uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
                >
                  {loading ? "Загрузка..." : "Продолжить"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="telegram"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleTelegramSubmit}
                className="space-y-6"
              >
                {/* Code */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Код из Telegram
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full px-4 py-4 rounded-xl text-white text-center text-2xl font-black tracking-widest indent-[0.1em] placeholder:text-gray-600 focus:placeholder:text-transparent transition-all"
                    style={{
                      background: "rgba(15, 15, 30, 0.8)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                    placeholder="000000"
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Проверьте Telegram @rrronin_bot
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-4 rounded-xl font-black text-white uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
                  >
                    {loading ? "Проверка..." : "Подтвердить"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="w-full py-3 rounded-xl font-medium text-gray-400 transition-all hover:text-white"
                    style={{ border: "1px solid rgba(139, 92, 246, 0.3)" }}
                  >
                    ← Назад
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Все действия логируются в целях безопасности
        </p>
      </motion.div>
    </div>
  );
}
