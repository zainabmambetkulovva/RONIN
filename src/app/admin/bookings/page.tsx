"use client";

import { useState } from "react";

interface Booking {
  id: string;
  bookingNumber: string;
  userName: string;
  computerNumber: number;
  tariff: string;
  startAt: string;
  endAt: string;
  price: number;
  status: "active" | "pending" | "completed" | "cancelled";
}

const initialBookings: Booking[] = [
  {
    id: "1",
    bookingNumber: "BK-001",
    userName: "Алексей Иванов",
    computerNumber: 1,
    tariff: "VIP - 2 часа",
    startAt: "2024-01-15 14:00",
    endAt: "2024-01-15 16:00",
    price: 800,
    status: "active",
  },
  {
    id: "2",
    bookingNumber: "BK-002",
    userName: "Мария Петрова",
    computerNumber: 3,
    tariff: "Premium - 1 час",
    startAt: "2024-01-15 15:00",
    endAt: "2024-01-15 16:00",
    price: 300,
    status: "active",
  },
  {
    id: "3",
    bookingNumber: "BK-003",
    userName: "Иван Сидоров",
    computerNumber: 5,
    tariff: "Standard - 3 часа",
    startAt: "2024-01-15 18:00",
    endAt: "2024-01-15 21:00",
    price: 450,
    status: "pending",
  },
  {
    id: "4",
    bookingNumber: "BK-004",
    userName: "Елена Козлова",
    computerNumber: 2,
    tariff: "VIP - Ночной тариф",
    startAt: "2024-01-15 22:00",
    endAt: "2024-01-16 06:00",
    price: 2000,
    status: "pending",
  },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all");

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handleCancelBooking = (id: string) => {
    if (confirm("Отменить бронирование?")) {
      setBookings(
        bookings.map((b) =>
          b.id === id ? { ...b, status: "cancelled" as const } : b
        )
      );
    }
  };

  const handleCompleteBooking = (id: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: "completed" as const } : b
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "rgba(34,197,94,0.2)", text: "#22c55e", label: "Активно" };
      case "pending":
        return { bg: "rgba(251,146,60,0.2)", text: "#fb923c", label: "Ожидание" };
      case "completed":
        return { bg: "rgba(59,130,246,0.2)", text: "#3b82f6", label: "Завершено" };
      case "cancelled":
        return { bg: "rgba(239,68,68,0.2)", text: "#ef4444", label: "Отменено" };
      default:
        return { bg: "rgba(156,163,175,0.2)", text: "#9ca3af", label: status };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Бронирования</h1>
        <p className="text-gray-400">Live view активных сессий и бронирований</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Активные сейчас</div>
          <div className="text-3xl font-black text-green-400">
            {bookings.filter((b) => b.status === "active").length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(251,146,60,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Ожидают</div>
          <div className="text-3xl font-black text-orange-400">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Завершено сегодня</div>
          <div className="text-3xl font-black text-blue-400">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Выручка сегодня</div>
          <div className="text-3xl font-black text-purple-400">
            {bookings.reduce((sum, b) => sum + b.price, 0)} ₸
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "pending"
              ? "bg-orange-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Ожидают
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Завершенные
        </button>
      </div>

      {/* Bookings Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  № Брони
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  ПК
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Тариф
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Время
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-white/5 transition-colors"
                    style={{ borderBottom: "1px solid rgba(59,130,246,0.05)" }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">{booking.bookingNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{booking.userName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-bold">
                        ПК #{booking.computerNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{booking.tariff}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-sm">
                        <div>{booking.startAt}</div>
                        <div className="text-gray-500">{booking.endAt}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">{booking.price} ₸</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === "active" && (
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="px-3 py-1 rounded text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                          >
                            Завершить
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "active") && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                          >
                            Отменить
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p className="text-gray-400">Нет бронирований с выбранным фильтром</p>
        </div>
      )}
    </div>
  );
}
