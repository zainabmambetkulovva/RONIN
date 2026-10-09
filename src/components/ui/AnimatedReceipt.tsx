"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedReceiptProps {
  booking: {
    id: string;
    bookingCode: string;
    price: string;
    status: string;
    startAt: string;
    endAt: string;
    computer: {
      number: number;
      category: {
        name: string;
      };
    };
    tariff: {
      name: string;
    };
  };
  onView: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function AnimatedReceipt({ booking, onView, getStatusColor, getStatusText }: AnimatedReceiptProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => onView(booking.id)}
        className="receipt-card"
        style={{
          background: isHovered 
            ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))"
            : "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        {/* Hover overlay - shows full details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="receipt-overlay"
        >
          <div className="text-center text-white">
            <p className="text-3xl font-black mb-2">ПРОСМОТРЕТЬ</p>
            <p className="text-sm opacity-75">Нажмите чтобы открыть полный чек</p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Main info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                >
                  #{booking.computer.number}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{booking.computer.category.name}</h3>
                  <p className="text-gray-400 text-sm">{booking.tariff.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Дата</p>
                  <p className="text-white font-medium">
                    {new Date(booking.startAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Время</p>
                  <p className="text-white font-medium">
                    {new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(booking.endAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Код</p>
                  <p className="text-blue-400 font-bold">{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Сумма</p>
                  <p className="text-white font-bold">{booking.price} сом</p>
                </div>
              </div>
            </div>

            {/* Right: Status */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3">
              <div
                className="px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap"
                style={{
                  background: `${getStatusColor(booking.status)}22`,
                  color: getStatusColor(booking.status),
                  border: `1px solid ${getStatusColor(booking.status)}44`,
                }}
              >
                {getStatusText(booking.status)}
              </div>
              <svg
                className="w-6 h-6 text-blue-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .receipt-card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s;
        }

        .receipt-card:hover {
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
        }

        .receipt-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 1rem;
        }

        .receipt-card::before,
        .receipt-card::after {
          position: absolute;
          content: "";
          width: 20%;
          height: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
          transition: all 0.5s;
          z-index: 5;
        }

        .receipt-card::before {
          top: 0;
          right: 0;
          border-radius: 0 1rem 0 100%;
        }

        .receipt-card::after {
          bottom: 0;
          left: 0;
          border-radius: 0 100% 0 1rem;
        }

        .receipt-card:hover::before,
        .receipt-card:hover::after {
          width: 100%;
          height: 100%;
          border-radius: 1rem;
        }
      `}</style>
    </>
  );
}
