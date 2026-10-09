import { StatCard } from "@/components/admin/dashboard/StatCard";
import { UpcomingBookings } from "@/components/admin/dashboard/UpcomingBookings";
import { RecentUsers } from "@/components/admin/dashboard/RecentUsers";

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/stats`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const data = await getStats();
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Не удалось загрузить данные</h2>
          <p className="text-gray-400">Проверьте подключение к базе данных</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-400 text-sm">Статистика за сегодня</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Клиентов сегодня"
          value={data.clients.today}
          subtitle={`Всего: ${data.clients.total}`}
          icon="users"
          color="#ef4444"
        />
        <StatCard
          label="Менеджеров"
          value={data.managers.active}
          subtitle={`Всего: ${data.managers.total}`}
          icon="shield"
          color="#8b5cf6"
        />
        <StatCard
          label="Играют сейчас"
          value={data.bookings.active}
          subtitle={`Активных сессий`}
          icon="calendar"
          color="#ec4899"
        />
        <StatCard
          label="Забронировали"
          value={data.bookings.today}
          subtitle={`Бронирований сегодня`}
          icon="monitor"
          color="#3b82f6"
        />
        <StatCard
          label="Компьютеров"
          value={data.computers.available}
          subtitle={`Доступно`}
          icon="tag"
          color="#06b6d4"
        />
      </div>

      {/* Bottom row - Bookings and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingBookings bookings={data.upcomingBookings} />
        <RecentUsers users={data.recentUsers} />
      </div>
    </div>
  );
}
