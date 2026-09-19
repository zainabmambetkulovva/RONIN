import { StatCard } from "@/components/admin/dashboard/StatCard";
import { ActiveSessionsChart } from "@/components/admin/dashboard/ActiveSessionsChart";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { LiveSessions } from "@/components/admin/dashboard/LiveSessions";
import { RecentBookings } from "@/components/admin/dashboard/RecentBookings";

export default async function AdminDashboard() {
  // TODO: Fetch real data from database
  const stats = {
    activeSessions: 42,
    todayBookings: 28,
    revenue: 124500,
    activeComputers: 38,
    totalComputers: 96,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Активные сессии"
          value={stats.activeSessions}
          subtitle="Играют сейчас"
          color="#3b82f6"
          trend="+12%"
        />
        <StatCard
          label="Бронирований сегодня"
          value={stats.todayBookings}
          subtitle="Всего за день"
          color="#8b5cf6"
          trend="+8%"
        />
        <StatCard
          label="Выручка"
          value={`${(stats.revenue / 1000).toFixed(1)}K`}
          subtitle="За сегодня (сом)"
          color="#10b981"
          trend="+15%"
        />
        <StatCard
          label="Компьютеры"
          value={`${stats.activeComputers}/${stats.totalComputers}`}
          subtitle="В работе / Всего"
          color="#f59e0b"
          progress={(stats.activeComputers / stats.totalComputers) * 100}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveSessionsChart />
        <RevenueChart />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveSessions />
        <RecentBookings />
      </div>
    </div>
  );
}
