"use client";

import { useState } from "react";
import { startGoogleSignIn } from "@/lib/google-signin";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+996",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Телефон форматтоо
    if (name === "phone") {
      // Убираем все кроме цифр и +
      let cleaned = value.replace(/[^\d+]/g, "");
      
      // Если пользователь удалил +996, вернем обратно
      if (!cleaned.startsWith("+996")) {
        cleaned = "+996" + cleaned.replace(/^\+996/, "");
      }
      
      // Ограничиваем длину: +996 (4 символа) + 9 цифр = 13
      if (cleaned.length > 13) {
        cleaned = cleaned.slice(0, 13);
      }
      
      setFormData((prev) => ({
        ...prev,
        phone: cleaned,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Frontend валидация
    if (!formData.name.trim() || formData.name.length < 2) {
      setError("Имя должно быть минимум 2 символа");
      return;
    }

    // Валидация email или телефона (хотя бы одно обязательно)
    if (!useEmail && !usePhone) {
      setError("Email или телефон обязательны");
      return;
    }

    // Если выбран email, проверяем его
    if (useEmail && formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Неверный формат email");
      return;
    }

    // Если выбран телефон, проверяем его
    if (usePhone && formData.phone && !formData.phone.match(/^\+996\d{9}$/)) {
      setError("Неверный формат телефона. Пример: +996501234567");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: useEmail ? formData.email.trim().toLowerCase() : undefined,
          phone: usePhone ? formData.phone.trim() : undefined,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка регистрации");
      }

      // Сессия уже создана сервером — сразу в личный кабинет (или туда, откуда пришли)
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      window.location.href = callbackUrl && /^\/(?![\/\\])/.test(callbackUrl) ? callbackUrl : "/dashboard";
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при регистрации");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 space-y-5"
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

      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
          Имя и Фамилия
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        />
      </div>

      {/* Email field */}
      {useEmail && (
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          />
        </div>
      )}

      {/* Phone field */}
      {usePhone && (
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+996501234567"
            maxLength={13}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Формат: +996501234567</p>
        </div>
      )}

      {/* Toggle email/phone */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => {
            setUseEmail(!useEmail);
            if (!usePhone && !useEmail) setUsePhone(true);
          }}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            useEmail
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setUsePhone(!usePhone);
            if (!usePhone && !useEmail) setUseEmail(true);
          }}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            usePhone
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          Телефон
        </button>
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
          Пароль
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Минимум 6 символов"
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

      {/* Confirm password field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-2">
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        />
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
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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
        onClick={() => {
          // Тот же серверный OAuth-поток, что и на странице входа
          startGoogleSignIn();
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
        Войти через Google
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        Регистрируясь, вы соглашаетесь с{" "}
        <a href="/terms" className="text-blue-400 hover:text-blue-300">
          Условиями использования
        </a>{" "}
        и{" "}
        <a href="/privacy" className="text-blue-400 hover:text-blue-300">
          Политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
