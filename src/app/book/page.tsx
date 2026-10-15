"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Monitor, User } from "lucide-react";
import { UserMenu } from "@/components/user/UserMenu";

export default function BookPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [computers, setComputers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    categoryId: "",
    computerId: "",
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetch(`/api/computers?categoryId=${formData.categoryId}`)
        .then(res => res.json())
        .then(data => setComputers(data.computers || []));
    }
  }, [formData.categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/payment');
  };

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <UserMenu />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-white mb-8 uppercase tracking-tight">Бронирование</h1>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                <User className="w-4 h-4" />
                Имя
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                placeholder="Введите имя"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Дата
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  Время
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                <Monitor className="w-4 h-4" />
                Категория ПК
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value, computerId: ""})}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {formData.categoryId && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Компьютер
                </label>
                <select
                  required
                  value={formData.computerId}
                  onChange={(e) => setFormData({...formData, computerId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" }}
                >
                  <option value="">Выберите компьютер</option>
                  {computers.map(comp => (
                    <option key={comp.id} value={comp.id}>ПК #{comp.number}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-8 px-6 py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "#fff" }}
          >
            Продолжить к оплате
          </button>
        </form>
      </main>
    </div>
  );
}
