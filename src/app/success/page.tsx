"use client";

import { CheckCircle, Download, Send, Eye } from "lucide-react";
import { UserMenu } from "@/components/user/UserMenu";

export default function SuccessPage() {
  const booking = {
    code: "12345",
    number: "RON-2026-001",
    date: "18 сентября 2026",
    time: "14:00 - 16:00",
    computer: "ПК #15",
    category: "Premium",
    price: "300 сом",
  };

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <UserMenu />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 mx-auto mb-4" style={{ color: "#10b981" }} />
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Забронировано!</h1>
          <p className="text-gray-400">Ваше бронирование успешно создано</p>
        </div>

        <div className="rounded-2xl p-8 mb-6" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", border: "2px solid rgba(16,185,129,0.5)" }}>
          <div className="text-center mb-8">
            <div className="text-6xl font-black mb-2" style={{ color: "#10b981" }}>{booking.code}</div>
            <p className="text-sm text-gray-400">5-значный код</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(15,15,30,0.5)" }}>
              <span className="text-gray-400">Номер бронирования</span>
              <span className="font-bold text-white">{booking.number}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(15,15,30,0.5)" }}>
              <span className="text-gray-400">Дата</span>
              <span className="font-bold text-white">{booking.date}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(15,15,30,0.5)" }}>
              <span className="text-gray-400">Время</span>
              <span className="font-bold text-white">{booking.time}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(15,15,30,0.5)" }}>
              <span className="text-gray-400">Компьютер</span>
              <span className="font-bold text-white">{booking.computer} ({booking.category})</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(15,15,30,0.5)" }}>
              <span className="text-gray-400">Сумма</span>
              <span className="font-bold text-white">{booking.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
              <Eye className="w-5 h-5 mx-auto mb-1" />
              Смотреть
            </button>
            <button className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>
              <Download className="w-5 h-5 mx-auto mb-1" />
              Скачать
            </button>
            <button className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
              <Send className="w-5 h-5 mx-auto mb-1" />
              Отправить
            </button>
          </div>
        </div>

        <a href="/dashboard" className="block w-full px-6 py-4 rounded-xl font-black text-lg uppercase tracking-wider text-center transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "#fff" }}>
          На главную
        </a>
      </main>
    </div>
  );
}
