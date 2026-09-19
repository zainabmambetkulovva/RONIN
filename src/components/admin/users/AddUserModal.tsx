"use client";

import { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "client" as "client" | "manager" | "admin",
    status: "active" as "active" | "blocked",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка создания пользователя");
      }

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "client",
        status: "active",
      });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #0a0a1a, #0f0f2e)",
          border: "1px solid rgba(59,130,246,0.3)",
          boxShadow: "0 0 60px rgba(59,130,246,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white">Добавить пользователя</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Имя и Фамилия <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Бекболот Алымкулов"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Телефон <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+996 555 123 456"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Пароль <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            />
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Роль <span className="text-red-400">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-white outline-none transition-all focus:ring-2 focus:ring-blue-500"
                style={{
                  background: "rgba(15,15,30,0.6)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <option value="client">Client</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Статус <span className="text-red-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-white outline-none transition-all focus:ring-2 focus:ring-blue-500"
                style={{
                  background: "rgba(15,15,30,0.6)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <option value="active">Активен</option>
                <option value="blocked">Заблокирован</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-white font-bold transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(59,130,246,0.3)" }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg text-white font-bold transition-all hover:scale-105 disabled:opacity-50"
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                boxShadow: "0 0 20px rgba(59,130,246,0.4)",
              }}
            >
              {isLoading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
