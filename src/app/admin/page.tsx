"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { UpcomingBookings } from "@/components/admin/dashboard/UpcomingBookings";
import { RecentUsers } from "@/components/admin/dashboard/RecentUsers";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-400">
            Check database connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
          DASHBOARD
        </h1>
        <p className="text-gray-400 text-sm">
          Statistics for today
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Clients Today"
          value={data.clients.today}
          subtitle={`Total: ${data.clients.total}`}
          icon="users"
          color="#ef4444"
        />
        <StatCard
          label="Managers"
          value={data.managers.active}
          subtitle={`Total: ${data.managers.total}`}
          icon="shield"
          color="#8b5cf6"
        />
        <StatCard
          label="Playing Now"
          value={data.bookings.active}
          subtitle="Active Sessions"
          icon="calendar"
          color="#ec4899"
        />
        <StatCard
          label="Booked"
          value={data.bookings.today}
          subtitle="Bookings Today"
          icon="monitor"
          color="#3b82f6"
        />
        <StatCard
          label="Computers"
          value={data.computers.available}
          subtitle="Available"
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
