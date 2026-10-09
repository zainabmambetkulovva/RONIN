"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface AddManagerModalProps {
  onClose: () => void;
}

export function AddManagerModal({ onClose }: AddManagerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка при создании менеджера');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Ошибка при создании менеджера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase">Добавить менеджера</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Имя *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
              placeholder="+996 XXX XXX XXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors"
              style={{
                background: "rgba(107,114,128,0.2)",
                border: "1px solid rgba(107,114,128,0.3)",
                color: "#9ca3af",
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                color: "#fff",
              }}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
