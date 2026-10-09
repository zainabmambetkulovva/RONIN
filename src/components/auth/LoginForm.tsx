"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Шаг 1: Проверка логина/пароля
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Проверить является ли пользователь админом/менеджером
      const checkResponse = await fetch("/api/admin/auth/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const checkData = await checkResponse.json();

      // Если это админ/менеджер - требуется 2FA
      if (checkResponse.ok) {
        setUserId(checkData.userId);
        setUserRole(checkData.role || "admin");
        setStep("2fa");
        setIsLoading(false);
        return;
      }

      // Если это обычный клиент - вход без 2FA
      if (checkResponse.status === 403 || checkData.error?.includes("Доступ запрещен")) {
        // Обычная авторизация для клиентов
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          throw new Error("Неверный email или пароль");
        }

        // Перенаправить в профиль
        router.push("/profile");
        return;
      }

      // Другие ошибки
      throw new Error(checkData.error || "Ошибка авторизации");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Шаг 2: Проверка 2FA кода для админов/менеджеров
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Неверный код");
      }

      // Успешно - перенаправить в админку
      const redirectPath = userRole === "admin" ? "/admin" : "/manager";
      window.location.href = redirectPath; // Прямое перенаправление без NextAuth
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-8 space-y-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))",
        border: "1px solid rgba(59,130,246,0.2)",
        boxShadow: "0 0 40px rgba(59,130,246,0.15)",
      }}
    >
      {/* Шаг 1: Email/Пароль */}
      {step === "credentials" && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
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

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ronin.kg"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                style={{
                  background: "rgba(15,15,30,0.6)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Забыли пароль?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 24px rgba(59,130,246,0.5)",
            }}
          >
            {isLoading ? "Проверка..." : "Войти"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-px" style={{ background: "rgba(59,130,246,0.2)" }} />
            <span className="relative px-4 text-sm text-gray-400" style={{ background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))" }}>
              или
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105 flex items-center justify-center gap-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Войти через Google
          </button>
        </form>
      )}

      {/* Шаг 2: 2FA Код (только для админов/менеджеров) */}
      {step === "2fa" && (
        <form onSubmit={handle2FASubmit} className="space-y-6">
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <svg className="w-8 h-8" style={{ color: "#3b82f6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Проверка безопасности</h2>
            <p className="text-sm text-gray-400">
              Код отправлен в ваш Telegram<br />
              <span className="text-blue-400">@rrronin_bot</span>
            </p>
          </div>

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

          <div>
            <label className="block text-sm font-bold text-white mb-2 text-center">
              Введите 6-значный код
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              className="w-full px-4 py-4 rounded-xl text-white text-center text-2xl font-black tracking-widest placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
              placeholder="000000"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full py-3 rounded-xl font-black uppercase text-white transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 24px rgba(59,130,246,0.5)",
            }}
          >
            {isLoading ? "Проверка..." : "Подтвердить"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("credentials");
              setCode("");
              setError("");
            }}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Назад
          </button>
        </form>
      )}
    </div>
  );
}
