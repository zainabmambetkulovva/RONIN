import { prisma } from "@/lib/prisma";
import { ComputersTable } from "@/components/admin/ComputersTable";

export default async function ComputersPage() {
  const now = new Date();
  
  // Получить все компьютеры с АКТИВНЫМИ бронированиями (которые идут прямо сейчас)
  const computersData = await prisma.computers.findMany({
    include: {
      bookings: {
        where: {
          status: {
            in: ["confirmed"],
          },
          start_at: {
            lte: now, // Бронирование уже началось
          },
          end_at: {
            gte: now, // И еще не закончилось
          },
        },
        orderBy: {
          start_at: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  // Transform snake_case to camelCase for frontend
  const computers = computersData.map((c) => ({
    id: c.id,
    number: c.number,
    name: `Computer ${c.number}`, // You might want to add a name field to schema
    status: c.status,
    specs: c.specifications,
    bookings: c.bookings.map((b) => ({
      id: b.id,
      startAt: b.start_at,
      endAt: b.end_at,
      status: b.status,
    })),
  }));

  // Статистика
  const stats = {
    total: computers.length,
    available: computers.filter((c) => c.status === "available" && c.bookings.length === 0).length,
    occupied: computers.filter((c) => c.bookings.length > 0).length,
    maintenance: computers.filter((c) => c.status === "maintenance").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Компьютеры</h1>
        <p className="text-gray-400">Управление компьютерами клуба</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Доступно</div>
          <div className="text-3xl font-black" style={{ color: "#22c55e" }}>
            {stats.available}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Занято</div>
          <div className="text-3xl font-black" style={{ color: "#ef4444" }}>
            {stats.occupied}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(251,146,60,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">На ремонте</div>
          <div className="text-3xl font-black" style={{ color: "#fb923c" }}>
            {stats.maintenance}
          </div>
        </div>
      </div>

      {/* Таблица компьютеров */}
      <ComputersTable computers={computers} />
    </div>
  );
}
