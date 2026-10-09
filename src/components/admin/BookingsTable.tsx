"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Booking {
  id: string;
  bookingNumber: string;
  bookingCode: string;
  startAt: Date;
  endAt: Date;
  durationMinutes: number;
  price: number;
  status: string;
  user: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  computer: {
    number: number;
  };
  tariff: {
    name: string;
  };
}

interface Props {
  bookings: Booking[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидание", color: "#fb923c" },
  confirmed: { label: "Подтверждено", color: "#3b82f6" },
  completed: { label: "Завершено", color: "#22c55e" },
  cancelled: { label: "Отменено", color: "#ef4444" },
  expired: { label: "Истекло", color: "#6b7280" },
};

export function BookingsTable({ bookings }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Фильтрация
  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch =
      search === "" ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.user.phone?.includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
        border: "1px solid rgba(59,130,246,0.2)",
      }}
    >
      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по номеру, коду, имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидание</option>
          <option value="confirmed">Подтверждено</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(59,130,246,0.1)" }}>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">№</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Код</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Пользователь</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Компьютер</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Время</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Тариф</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Цена</th>
              <th className="text-left py-3 px-2 text-sm font-bold text-gray-400">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Бронирования не найдены
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-white/5 transition-colors"
                  style={{ borderColor: "rgba(59,130,246,0.05)" }}
                >
                  <td className="py-3 px-2 text-sm text-white font-medium">
                    {booking.bookingNumber}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    <span
                      className="px-2 py-1 rounded font-bold"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color: "#3b82f6",
                      }}
                    >
                      {booking.bookingCode}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    <div className="text-white font-medium">{booking.user.name}</div>
                    <div className="text-gray-500 text-xs">
                      {booking.user.email || booking.user.phone}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-white font-bold">
                    #{booking.computer.number}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-300">
                    <div>{format(new Date(booking.startAt), "dd MMM yyyy", { locale: ru })}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(booking.startAt), "HH:mm")} -{" "}
                      {format(new Date(booking.endAt), "HH:mm")}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">{booking.tariff.name}</td>
                  <td className="py-3 px-2 text-sm">
                    <span className="text-white font-bold">{booking.price} с</span>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    <span
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        background: `${statusLabels[booking.status]?.color}20`,
                        color: statusLabels[booking.status]?.color,
                      }}
                    >
                      {statusLabels[booking.status]?.label}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Показано {filtered.length} из {bookings.length}
        </div>
      </div>
    </div>
  );
}
