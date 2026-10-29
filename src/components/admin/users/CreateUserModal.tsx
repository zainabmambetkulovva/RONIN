"use client";

import { useState } from "react";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { X } from "lucide-react";
import { KG_PHONE_ERROR, PERSON_NAME_ERROR, isValidPersonName, normalizeKgPhone } from "@/lib/phone";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "client",
    password: "",
    telegramChatId: "",
  });
  const isStaff = formData.role !== "client";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidPersonName(formData.name)) {
      setError(PERSON_NAME_ERROR);
      return;
    }

    if (!formData.email && !formData.phone) {
      setError("Укажите email или телефон");
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Некорректный email");
      return;
    }
    if (formData.phone && !normalizeKgPhone(formData.phone)) {
      setError(KG_PHONE_ERROR);
      return;
    }
    // Сотрудник входит в панель: email + пароль, затем код в Telegram
    if (isStaff) {
      if (!formData.email) return setError("Для сотрудника укажите email — по нему вход в панель");
      if (formData.password.length < 8) return setError("Пароль сотрудника — не короче 8 символов");
      if (formData.telegramChatId && !/^-?\d{4,20}$/.test(formData.telegramChatId.trim())) return setError("Telegram ID — только цифры");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isStaff ? formData : { name: formData.name, email: formData.email, phone: formData.phone, role: formData.role }
        ),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка создания пользователя");
      }
    } catch (error) {
      console.error("Create error:", error);
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(3,3,10,0.9)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Новый пользователь
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <X className="w-5 h-5" style={{ color: "#ef4444" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white font-bold text-sm mb-2">
              Имя <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите имя"
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-bold text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white font-bold text-sm mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+996 XXX XXX XXX"
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-white font-bold text-sm mb-2">
              Роль <span className="text-red-400">*</span>
            </label>
            <StyledSelect
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
            >
              <option value="client">Клиент</option>
              <option value="admin">Администратор</option>
            </StyledSelect>
          </div>

          {isStaff && (
            <>
              <div>
                <label className="block text-white font-bold text-sm mb-2">
                  Пароль <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Не короче 8 символов"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                />
              </div>
              <div>
                <label className="block text-white font-bold text-sm mb-2">Telegram ID</label>
                <input
                  inputMode="numeric"
                  value={formData.telegramChatId}
                  onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value.replace(/[^\d-]/g, "") })}
                  placeholder="Например 123456789"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  Сюда приходит код входа в панель. Узнать ID: написать боту @userinfobot; затем нажать «Start» в боте клуба.
                </p>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div
              className="p-3 rounded-lg text-sm text-red-400"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa",
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                color: "#fff",
              }}
            >
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
