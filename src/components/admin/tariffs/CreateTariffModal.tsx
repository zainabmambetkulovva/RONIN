"use client";

import { useState } from "react";
import { StyledSelect } from "@/components/ui/StyledSelect";
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
      style={{ background: "rgba(3,3,10,0.85)" }} 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl" 
        style={{ 
          background: "linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(15,15,30,0.95) 100%)", 
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 0 40px rgba(139,92,246,0.2)"
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wide">НОВЫЙ ТАРИФ</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Название *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
              style={{ 
                background: "rgba(10,10,20,0.6)", 
                border: "1px solid rgba(139,92,246,0.2)" 
              }} 
              placeholder="Введите название"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Цена (сом) *</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
                style={{ 
                  background: "rgba(10,10,20,0.6)", 
                  border: "1px solid rgba(139,92,246,0.2)" 
                }} 
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Минуты *</label>
              <input 
                type="number" 
                value={formData.durationMinutes} 
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
                style={{ 
                  background: "rgba(10,10,20,0.6)", 
                  border: "1px solid rgba(139,92,246,0.2)" 
                }} 
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Тип *</label>
            <StyledSelect 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
              style={{ 
                background: "rgba(10,10,20,0.6)", 
                border: "1px solid rgba(139,92,246,0.2)" 
              }}
            >
              <option value="hourly">Почасовой</option>
              <option value="package">Пакетный</option>
              <option value="night">Ночной</option>
              <option value="morning">Утренний</option>
            </StyledSelect>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Категория</label>
            <StyledSelect 
              value={formData.categoryId} 
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" 
              style={{ 
                background: "rgba(10,10,20,0.6)", 
                border: "1px solid rgba(139,92,246,0.2)" 
              }}
            >
              <option value="">Все категории</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </StyledSelect>
          </div>

          {error && (
            <div 
              className="p-3 rounded-xl text-sm text-red-300" 
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all" 
              style={{ border: "1px solid rgba(139,92,246,0.3)" }}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50 hover:scale-105 transition-all" 
              style={{ 
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.3)"
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
