"use client";

import { useState } from "react";

interface ThreatSummaryChartProps {
  bookings: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

export function ThreatSummaryChart({ bookings }: ThreatSummaryChartProps) {
  const [period, setPeriod] = useState("Yearly");

  // Mock data для графика (в реальности будет из API)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = [320, 280, 350, 400, 380, 420, 450, 410, 390, 420, 460, 500];

  const maxValue = Math.max(...data);

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">
            Booking Summary
          </h3>
          <p className="text-xs text-gray-500">Статистика бронирований за год</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#60a5fa",
          }}
        >
          <option>Daily</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-gray-800" />
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>500k</span>
          <span>400k</span>
          <span>300k</span>
          <span>200k</span>
          <span>100k</span>
          <span>0%</span>
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around pl-10 pr-2">
          {data.map((value, i) => {
            const height = (value / maxValue) * 100;
            const isHighlight = i === 5; // June 2024
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Bar */}
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer relative"
                  style={{
                    height: `${height}%`,
                    background: isHighlight
                      ? "linear-gradient(180deg, #8b5cf6 0%, #ec4899 100%)"
                      : "linear-gradient(180deg, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.3) 100%)",
                    minHeight: "4px",
                  }}
                >
                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value} бронь
                  </div>

                  {/* Highlight badge */}
                  {isHighlight && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                        color: "#fff",
                      }}
                    >
                      June 2024 Threat 22
                    </div>
                  )}
                </div>

                {/* Month label */}
                <span className="text-[10px] font-medium text-gray-500 group-hover:text-white transition-colors">
                  {months[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#3b82f6" }} />
          <span className="text-xs text-gray-400">Обычные</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }} />
          <span className="text-xs text-gray-400">Пиковые</span>
        </div>
      </div>
    </div>
  );
}
