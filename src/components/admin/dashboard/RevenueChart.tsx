"use client";

export function RevenueChart() {
  const weeklyRevenue = [
    { day: "Пн", amount: 18500 },
    { day: "Вт", amount: 22300 },
    { day: "Ср", amount: 19800 },
    { day: "Чт", amount: 24100 },
    { day: "Пт", amount: 29400 },
    { day: "Сб", amount: 35200 },
    { day: "Вс", amount: 31800 },
  ];

  const maxAmount = Math.max(...weeklyRevenue.map((d) => d.amount));
  const totalWeek = weeklyRevenue.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-white">Выручка</h3>
          <p className="text-sm text-gray-400">За неделю</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: "#10b981" }}>
            {(totalWeek / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500">сом</p>
        </div>
      </div>

      {/* Area chart mockup */}
      <div className="relative h-40 flex items-end gap-2">
        {weeklyRevenue.map((item, i) => {
          const heightPercent = (item.amount / maxAmount) * 100;
          const isToday = i === weeklyRevenue.length - 1;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-bold" style={{ color: isToday ? "#10b981" : "#60a5fa" }}>
                {(item.amount / 1000).toFixed(1)}K
              </div>
              <div className="w-full relative" style={{ height: "100px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${heightPercent}%`,
                    background: isToday
                      ? "linear-gradient(to top, #10b981, #34d399)"
                      : "linear-gradient(to top, rgba(59,130,246,0.5), rgba(139,92,246,0.5))",
                    boxShadow: isToday ? "0 0 20px rgba(16,185,129,0.6)" : "none",
                  }}
                />
              </div>
              <div
                className={`text-xs font-medium ${isToday ? "text-green-400" : "text-gray-500"}`}
              >
                {item.day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth indicator */}
      <div className="mt-6 flex items-center gap-3">
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "rgba(16,185,129,0.15)" }}
        >
          <svg className="w-4 h-4" style={{ color: "#10b981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-bold" style={{ color: "#10b981" }}>
            +15.3%
          </span>
        </div>
        <span className="text-xs text-gray-400">по сравнению с прошлой неделей</span>
      </div>
    </div>
  );
}
