"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, MemoryStick } from "lucide-react";

interface Computer {
  id: string;
  number: number;
  category: {
    name: string;
  };
  specifications: any;
  status: "available" | "maintenance";
}

interface Props {
  computers: Computer[];
  onComputerClick: (computer: Computer) => void;
}

export function ComputerGrid({ computers, onComputerClick }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return {
          bg: "rgba(34, 197, 94, 0.1)",
          border: "rgba(34, 197, 94, 0.3)",
          text: "#22c55e",
          label: "🟢 Свободен",
        };
      case "maintenance":
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          border: "rgba(107, 114, 128, 0.3)",
          text: "#6b7280",
          label: "⚫ Обслуживание",
        };
      default:
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          text: "#ef4444",
          label: "🔴 Занят",
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      {computers.map((computer, index) => {
        const statusStyle = getStatusColor(computer.status);
        const isAvailable = computer.status === "available";

        return (
          <motion.button
            key={computer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            onClick={() => isAvailable && onComputerClick(computer)}
            disabled={!isAvailable}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              ${isAvailable 
                ? "hover:scale-105 hover:shadow-lg cursor-pointer" 
                : "opacity-50 cursor-not-allowed"
              }
            `}
            style={{
              background: statusStyle.bg,
              borderColor: statusStyle.border,
            }}
            whileHover={isAvailable ? { y: -4 } : {}}
          >
            {/* Номер компьютера */}
            <div className="text-center mb-3">
              <div className="text-3xl font-black" style={{ color: statusStyle.text }}>
                {computer.number}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
                {computer.category.name}
              </div>
            </div>

            {/* Иконка монитора */}
            <div className="flex justify-center mb-2">
              <Monitor className="w-8 h-8" style={{ color: statusStyle.text }} />
            </div>

            {/* Статус */}
            <div className="text-xs font-semibold text-center" style={{ color: statusStyle.text }}>
              {statusStyle.label}
            </div>

            {/* Hover эффект */}
            {isAvailable && (
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at center, ${statusStyle.border} 0%, transparent 70%)`,
                  }}
                />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
