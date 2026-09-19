"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
  trend?: string;
  progress?: number;
}

export function StatCard({ label, value, subtitle, color, trend, progress }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-5 overflow-hidden group"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: color }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">{label}</span>
          {trend && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{
                background: trend.startsWith("+") ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                color: trend.startsWith("+") ? "#10b981" : "#ef4444",
              }}
            >
              {trend}
            </span>
          )}
        </div>

        <div className="mb-2">
          <span
            className="text-3xl font-black"
            style={{
              background: `linear-gradient(90deg, ${color}, ${color}dd)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 10px ${color}66)`,
            }}
          >
            {value}
          </span>
        </div>

        <p className="text-xs text-gray-500">{subtitle}</p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,0.1)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover effect border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${color}44` }}
      />
    </motion.div>
  );
}
