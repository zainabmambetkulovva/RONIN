"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'no_code': 'Код авторизации не получен от Google',
        'token_exchange': 'Ошибка обмена токенов с Google',
        'user_info': 'Не удалось получить данные пользователя',
        'oauth_error': 'Ошибка OAuth авторизации',
        'access_denied': 'Вы отклонили доступ к Google аккаунту',
        'config': 'Вход через Google на этом сайте ещё не настроен. Войдите по email или попробуйте позже',
        'account_blocked': 'Аккаунт заблокирован. Обратитесь в клуб',
        'state': 'Сессия входа устарела. Попробуйте войти через Google ещё раз'
      };
      setError(errorMessages[errorParam] || 'Ошибка авторизации через Google');
    }
  }, [searchParams]);

  // Шаг 1: Проверка логина/пароля
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Проверяем credentials через API
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || t("auth.invalidCredentials") || "Неверный email или пароль");
      }

      // Успешный вход: cookie сессии установлен сервером. Возвращаем туда, откуда пришёл пользователь
      // (только внутренние пути, чтобы ссылка не могла увести на чужой сайт)
      const callbackUrl = searchParams.get("callbackUrl");
      const safe = callbackUrl && /^\/(?![\/\\])/.test(callbackUrl) ? callbackUrl : "/dashboard";
      window.location.href = safe;
      
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
              {t("auth.email") || "Email"}
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
              {t("auth.password") || "Пароль"}
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
              {t("auth.forgotPassword") || "Забыли пароль?"}
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
            {isLoading ? t("auth.checking") || "Проверка..." : t("auth.loginButton") || "Войти"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-px" style={{ background: "rgba(59,130,246,0.2)" }} />
            <span className="relative px-4 text-sm text-gray-400" style={{ background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))" }}>
              {t("auth.or") || "или"}
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => {
              const callbackUrl = searchParams.get("callbackUrl");
              window.location.href = `/api/auth/google${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
            }}
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
            {t("auth.googleLogin") || "Войти через Google"}
          </button>
        </form>
    </div>
  );
}
