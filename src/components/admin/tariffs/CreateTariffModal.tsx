"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function CreateTariffModal({ categories, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    durationMinutes: "",
    price: "",
    type: "hourly",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.durationMinutes || !formData.price) {
      setError("Заполните все обязательные поля");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/tariffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка создания");
      }
    } catch (error) {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,3,10,0.9)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", border: "1px solid rgba(16,185,129,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white uppercase">Новый тариф</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.2)" }}>
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-bold text-sm mb-2">Название *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", color: "#fff" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold text-sm mb-2">Цена (с) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", color: "#fff" }} />
            </div>
            <div>
              <label className="block text-white font-bold text-sm mb-2">Минуты *</label>
              <input type="number" value={formData.durationMinutes} onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", color: "#fff" }} />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-2">Тип *</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", color: "#fff" }}>
              <option value="hourly">Почасовой</option>
              <option value="package">Пакетный</option>
              <option value="night">Ночной</option>
              <option value="morning">Утренний</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-2">Категория</label>
            <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", color: "#fff" }}>
              <option value="">Без категории</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)" }}>{error}</div>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl font-bold text-sm" style={{ border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>Отмена</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff" }}>
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
