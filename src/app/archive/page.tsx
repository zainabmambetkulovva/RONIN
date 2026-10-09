"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { FullPageLoader } from "@/components/ui/RollingLoader";
import { AnimatedReceipt } from "@/components/ui/AnimatedReceipt";

interface Booking {
  id: string;
  bookingNumber: string;
  bookingCode: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  price: string;
  status: string;
  isExpired: boolean;
  computer: {
    number: number;
    category: {
      name: string;
    };
  };
  tariff: {
    name: string;
  };
  payments: Array<{
    status: string;
    paidAt: string;
  }>;
}

export default function ArchivePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "expired">("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "completed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      case "expired":
        return "#6b7280";
      default:
        return "#f59e0b";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидание";
      case "confirmed":
        return "Подтверждено";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      case "expired":
        return "Истекло";
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "active") return booking.status === "confirmed" || booking.status === "pending";
    if (filter === "completed") return booking.status === "completed";
    if (filter === "expired") return booking.status === "expired" || booking.status === "cancelled";
    return true;
  });

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking-success?bookingId=${bookingId}`);
  };

  if (loading) {
    return <FullPageLoader text="Загрузка истории..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <MobileMenu />
      {/* Background effects */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Архив бронирований
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            История всех твоих бронирований в RONIN
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {[
            { value: "all", label: "Все", count: bookings.length },
            {
              value: "active",
              label: "Активные",
              count: bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length,
            },
            {
              value: "completed",
              label: "Завершённые",
              count: bookings.filter((b) => b.status === "completed").length,
            },
            {
              value: "expired",
              label: "Истекшие",
              count: bookings.filter((b) => b.status === "expired" || b.status === "cancelled").length,
            },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                filter === f.value
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{
                background: filter === f.value ? "linear-gradient(90deg, #1d4ed8, #7c3aed)" : "rgba(59,130,246,0.1)",
                border: `1px solid ${filter === f.value ? "transparent" : "rgba(59,130,246,0.3)"}`,
              }}
            >
              {f.label} <span className="ml-1">({f.count})</span>
            </button>
          ))}
        </motion.div>

        {/* Bookings list */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-4">Нет бронирований</p>
            <button
              onClick={() => router.push("/booking")}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
                boxShadow: "0 0 30px rgba(99,102,241,0.3)",
              }}
            >
              Создать бронирование
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AnimatedReceipt
                  booking={booking}
                  onView={handleViewBooking}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
