"use client";

import { Users, Monitor, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export function QuickStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Stats error:', err));
  }, []);

  if (!stats) return null;

  const quickStats = [
    {
      icon: Users,
      label: "Клиентов сегодня",
      value: stats.clients.active,
      color: "#8b5cf6",
    },
    {
      icon: Monitor,
      label: "Занято компьютеров",
      value: `${stats.computers.occupied}/${stats.computers.total}`,
      color: "#3b82f6",
    },
    {
      icon: Clock,
      label: "Активных бронирований",
      value: stats.bookings.active,
      color: "#ec4899",
    },
    {
      icon: TrendingUp,
      label: "Завершено за сегодня",
      value: stats.bookings.completed,
      color: "#10b981",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-black text-white uppercase mb-4">Быстрая статистика</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{
                background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
                border: `1px solid ${stat.color}33`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${stat.color}22`,
                    border: `1px solid ${stat.color}44`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
