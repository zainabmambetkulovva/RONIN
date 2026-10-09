"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateManagerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateManagerModal({ onClose, onSuccess }: CreateManagerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Введите имя");
      return;
    }

    if (!formData.email && !formData.phone) {
      setError("Укажите email или телефон");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "manager", // Always create as manager
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка создания менеджера");
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
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Новый менеджер
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

        {/* Info */}
        <div
          className="mb-6 p-4 rounded-lg text-sm"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#a78bfa",
          }}
        >
          Менеджер получит доступ к панели управления для работы с бронированиями и клиентами.
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
              placeholder="Введите имя менеджера"
              className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(59,130,246,0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 30px rgba(59,130,246,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(59,130,246,0.3)";
                e.target.style.boxShadow = "0 0 20px rgba(59,130,246,0.1)";
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
              className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(139,92,246,0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8b5cf6";
                e.target.style.boxShadow = "0 0 30px rgba(139,92,246,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(139,92,246,0.3)";
                e.target.style.boxShadow = "0 0 20px rgba(139,92,246,0.1)";
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
              className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(139,92,246,0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8b5cf6";
                e.target.style.boxShadow = "0 0 30px rgba(139,92,246,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(139,92,246,0.3)";
                e.target.style.boxShadow = "0 0 20px rgba(139,92,246,0.1)";
              }}
            />
          </div>

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
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
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
