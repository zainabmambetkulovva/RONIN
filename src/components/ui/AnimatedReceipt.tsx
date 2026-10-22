"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, DollarSign, User } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  computer_id?: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface AnimatedReceiptProps {
  booking: Booking;
  onView?: (booking: Booking) => void;
}

export function AnimatedReceipt({ booking, onView }: AnimatedReceiptProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-2xl border border-purple-500/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Бронирование #{booking.id.slice(0, 8)}
          </h3>
          <p className="text-gray-400 text-sm">
            {new Date(booking.created_at).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          booking.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-sm">{new Date(booking.date).toLocaleDateString('ru-RU')}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-sm">{booking.start_time} - {booking.end_time}</span>
        </div>
        {booking.computer_id && (
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Компьютер #{booking.computer_id}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-gray-300">
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold">{booking.total_price} сом</span>
        </div>
      </div>

      {onView && (
        <button
          onClick={() => onView(booking)}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-colors"
        >
          Подробнее
        </button>
      )}
    </motion.div>
  );
}
