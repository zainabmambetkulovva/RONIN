"use client";

import { useState } from "react";
import { User, Monitor, Calendar, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingSearchResultProps {
  booking: any;
  onUpdate?: () => void;
}

export function BookingSearchResult({ booking, onUpdate }: BookingSearchResultProps) {
  const [cancelling, setCancelling] = useState(false);
  const isActive = new Date(booking.endAt) > new Date();
  const statusColor = booking.status === 'confirmed' ? '#10b981' : booking.status === 'cancelled' ? '#ef4444' : '#f59e0b';

  const handleCancel = async () => {
    if (!confirm(`Отменить бронирование ${booking.bookingCode}?`)) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`/api/manager/bookings/${booking.id}/cancel`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Бронирование отменено");
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка отмены");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Ошибка сети");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-8 mb-8"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: `2px solid ${statusColor}44`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black"
            style={{
              background: `linear-gradient(135deg, ${statusColor}, ${statusColor}cc)`,
              color: "#fff",
            }}
          >
            {booking.bookingCode}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase">Бронирование найдено</h3>
            <p className="text-sm text-gray-400">№ {booking.bookingNumber}</p>
          </div>
        </div>
        <div
          className="px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider"
          style={{
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}44`,
            color: statusColor,
          }}
        >
          {booking.status === 'confirmed' ? 'Активно' : booking.status === 'cancelled' ? 'Отменено' : 'Завершено'}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "rgba(15,15,30,0.5)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" style={{ color: "#a78bfa" }} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Клиент</h4>
          </div>
          <div className="text-xl font-black text-white mb-1">{booking.user.name}</div>
          <div className="text-sm text-gray-400">{booking.user.phone}</div>
          {booking.user.email && <div className="text-sm text-gray-400">{booking.user.email}</div>}
        </div>

        {/* Computer Info */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "rgba(15,15,30,0.5)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5" style={{ color: "#60a5fa" }} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Компьютер</h4>
          </div>
          <div className="text-xl font-black text-white mb-1">ПК #{booking.computer.number}</div>
          <div className="text-sm text-gray-400">{booking.computer.category.name}</div>
        </div>

        {/* Time Info */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "rgba(15,15,30,0.5)",
            border: "1px solid rgba(236,72,153,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{ color: "#ec4899" }} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Дата и время</h4>
          </div>
          <div className="text-lg font-black text-white mb-1">
            {format(new Date(booking.startAt), "dd MMMM yyyy", { locale: ru })}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(booking.startAt), "HH:mm")} - {format(new Date(booking.endAt), "HH:mm")}</span>
          </div>
        </div>

        {/* Price Info */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "rgba(15,15,30,0.5)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5" style={{ color: "#10b981" }} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Тариф</h4>
          </div>
          <div className="text-xl font-black text-white mb-1">{booking.tariff.name}</div>
          <div className="text-sm text-gray-400">{booking.price} сом • {booking.durationMinutes} минут</div>
        </div>
      </div>

      {/* Actions */}
      {booking.status === 'confirmed' && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
            }}
          >
            <XCircle className="w-5 h-5 inline mr-2" />
            {cancelling ? "Отмена..." : "Отменить бронирование"}
          </button>
        </div>
      )}
    </div>
  );
}
