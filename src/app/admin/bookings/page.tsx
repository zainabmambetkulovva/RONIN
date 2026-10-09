import { prisma } from "@/lib/prisma";
import { BookingsTable } from "@/components/admin/BookingsTable";

export default async function BookingsPage() {
  // Получить все бронирования с пользователями и компьютерами
  const bookingsData = await prisma.bookings.findMany({
    include: {
      users: true,
      computers: true,
      tariffs: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Transform snake_case to camelCase for frontend
  const bookings = bookingsData.map((b) => ({
    id: b.id,
    bookingNumber: b.booking_number,
    bookingCode: b.booking_code,
    startAt: b.start_at,
    endAt: b.end_at,
    durationMinutes: b.duration_minutes,
    price: Number(b.price),
    status: b.status,
    user: {
      name: b.users.name,
      email: b.users.email,
      phone: b.users.phone,
    },
    computer: {
      number: b.computers.number,
    },
    tariff: {
      name: b.tariffs.name,
    },
  }));

  // Статистика
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Бронирования</h1>
        <p className="text-gray-400">Управление бронированиями компьютеров</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Всего</div>
          <div className="text-3xl font-black text-white">{stats.total}</div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(251,146,60,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Ожидание</div>
          <div className="text-3xl font-black" style={{ color: "#fb923c" }}>
            {stats.pending}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Подтверждено</div>
          <div className="text-3xl font-black" style={{ color: "#3b82f6" }}>
            {stats.confirmed}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Завершено</div>
          <div className="text-3xl font-black" style={{ color: "#22c55e" }}>
            {stats.completed}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Отменено</div>
          <div className="text-3xl font-black" style={{ color: "#ef4444" }}>
            {stats.cancelled}
          </div>
        </div>
      </div>

      {/* Таблица бронирований */}
      <BookingsTable bookings={bookings} />
    </div>
  );
}
