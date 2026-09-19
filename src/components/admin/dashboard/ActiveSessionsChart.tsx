"use client";

export function ActiveSessionsChart() {
  // TODO: Integrate with real charting library (recharts or chart.js)
  const mockData = [
    { hour: "00:00", sessions: 12 },
    { hour: "04:00", sessions: 8 },
    { hour: "08:00", sessions: 15 },
    { hour: "12:00", sessions: 32 },
    { hour: "16:00", sessions: 45 },
    { hour: "20:00", sessions: 38 },
  ];

  const maxSessions = Math.max(...mockData.map((d) => d.sessions));

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-white">Активность сессий</h3>
          <p className="text-sm text-gray-400">За последние 24 часа</p>
        </div>
        <select
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-white outline-none"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      {/* Simple bar chart */}
      <div className="flex items-end justify-between gap-3 h-48">
        {mockData.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative" style={{ height: "150px" }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(item.sessions / maxSessions) * 100}%`,
                  background: "linear-gradient(to top, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.4)",
                }}
              />
            </div>
            <div className="text-xs text-gray-500 font-medium">{item.hour}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#3b82f6" }} />
          <span className="text-xs text-gray-400">Активные</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#8b5cf6" }} />
          <span className="text-xs text-gray-400">Пик нагрузки</span>
        </div>
      </div>
    </div>
  );
}
