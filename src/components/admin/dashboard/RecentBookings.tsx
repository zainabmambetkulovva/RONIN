"use client";

export function RecentBookings() {
  // TODO: Fetch from database
  const recentBookings = [
    {
      id: "#BK-1234",
      user: "Азамат М.",
      computer: "Premium-15",
      date: "2026-09-18",
      time: "20:00 - 23:00",
      status: "confirmed",
    },
    {
      id: "#BK-1235",
      user: "Гульнара А.",
      computer: "VIP-07",
      date: "2026-09-18",
      time: "18:30 - 22:00",
      status: "confirmed",
    },
    {
      id: "#BK-1236",
      user: "Санжар Б.",
      computer: "Standard-32",
      date: "2026-09-19",
      time: "14:00 - 16:00",
      status: "pending",
    },
    {
      id: "#BK-1237",
      user: "Айсулуу К.",
      computer: "Premium-21",
      date: "2026-09-19",
      time: "19:00 - 21:30",
      status: "confirmed",
    },
  ];

  const statusColors = {
    confirmed: { bg: "rgba(16,185,129,0.15)", text: "#10b981", label: "Подтверждено" },
    pending: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", label: "Ожидает" },
    cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", label: "Отменено" },
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-white">Последние брони</h3>
          <p className="text-sm text-gray-400">Недавние бронирования</p>
        </div>
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {recentBookings.map((booking) => {
          const statusStyle = statusColors[booking.status as keyof typeof statusColors];

          return (
            <div
              key={booking.id}
              className="p-4 rounded-xl hover:scale-[1.02] transition-transform"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-white">{booking.user}</p>
                  <p className="text-xs text-gray-400">{booking.id}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ background: statusStyle.bg, color: statusStyle.text }}
                >
                  {statusStyle.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Компьютер:</span>
                  <p className="text-white font-medium">{booking.computer}</p>
                </div>
                <div>
                  <span className="text-gray-500">Дата:</span>
                  <p className="text-white font-medium">{booking.date}</p>
                </div>
              </div>

              <div className="mt-2 text-xs">
                <span className="text-gray-500">Время:</span>
                <p className="text-blue-400 font-medium">{booking.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View all button */}
      <button
        className="w-full mt-4 py-2.5 rounded-lg text-sm font-bold text-blue-400 transition-all hover:bg-blue-500/10"
        style={{ border: "1px solid rgba(59,130,246,0.2)" }}
      >
        Все бронирования →
      </button>
    </div>
  );
}
