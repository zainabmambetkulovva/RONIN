"use client";

import { Clock, Monitor, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Booking {
  id: string;
  startAt: Date;
  endAt: Date;
  user: {
    name: string;
  };
  computer: {
    number: number;
    category: {
      name: string;
    };
  };
}

interface UpcomingBookingsProps {
  bookings: Booking[];
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">
            Upcoming Bookings
          </h3>
          <p className="text-xs text-gray-500">Следующие 24 часа</p>
        </div>
        <button className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#a78bfa",
          }}
        >
          Все →
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking, i) => (
            <div
              key={booking.id}
              className="flex items-center gap-4 p-3 rounded-lg transition-all hover:scale-[1.02] cursor-pointer group"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              {/* Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                style={{
                  background: "rgba(139,92,246,0.2)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#a78bfa",
                }}
              >
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-bold text-white truncate">
                    {booking.user.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    <span>ПК #{booking.computer.number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(booking.startAt), "HH:mm", { locale: ru })}</span>
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <div className="flex-shrink-0 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: "rgba(59,130,246,0.2)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#60a5fa",
                }}
              >
                {booking.computer.category.name}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет предстоящих бронирований</p>
          </div>
        )}
      </div>
    </div>
  );
}
