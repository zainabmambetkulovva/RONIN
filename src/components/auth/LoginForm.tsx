"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Replace with real API call to /api/auth/login
      // For now, mock authentication based on email pattern
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock logic: определяем роль по email
      let redirectPath = "/profile"; // default для clients

      if (email.includes("admin@")) {
        redirectPath = "/admin";
      } else if (email.includes("manager@")) {
        redirectPath = "/admin";
      }

      // TODO: Validate credentials against database
      // TODO: Create session with NextAuth or JWT
      // TODO: Store user data in session

      // Redirect based on role
      router.push(redirectPath);
    } catch (err) {
      setError("Неверный email или пароль");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 space-y-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))",
        border: "1px solid rgba(59,130,246,0.2)",
        boxShadow: "0 0 40px rgba(59,130,246,0.15)",
      }}
    >
      {/* Error message */}
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

      {/* Email field */}
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
          placeholder="admin@ronin.kg или client@example.com"
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Используйте ваш email, указанный при регистрации
        </p>
      </div>

      {/* Password field */}
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
            placeholder="Введите пароль"
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
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <a
          href="/forgot-password"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Забыли пароль?
        </a>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 0 24px rgba(59,130,246,0.5)",
        }}
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "rgba(59,130,246,0.1)" }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500" style={{ background: "rgba(7,7,26,0.95)" }}>
            или
          </span>
        </div>
      </div>

      {/* OAuth buttons (TODO: implement Google OAuth) */}
      <button
        type="button"
        className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center justify-center gap-3"
        style={{
          background: "rgba(15,15,30,0.6)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Войти через Google
      </button>

      {/* Info box для тестирования */}
      <div
        className="p-3 rounded-lg text-xs"
        style={{
          background: "rgba(59,130,246,0.05)",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <p className="text-gray-400 mb-1">
          <strong className="text-blue-400">Тестовые аккаунты:</strong>
        </p>
        <ul className="text-gray-500 space-y-0.5">
          <li>• admin@ronin.kg → Админ панель</li>
          <li>• manager@ronin.kg → Админ панель</li>
          <li>• client@example.com → Личный кабинет</li>
        </ul>
      </div>
    </form>
  );
}
