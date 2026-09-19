"use client";

export function LiveSessions() {
  // TODO: Fetch from database in real-time
  const activeSessions = [
    {
      id: "1",
      user: "Бекболот А.",
      computer: "VIP-12",
      startTime: "14:30",
      endTime: "18:00",
      status: "playing",
    },
    {
      id: "2",
      user: "Айжан К.",
      computer: "Premium-08",
      startTime: "15:00",
      endTime: "17:30",
      status: "playing",
    },
    {
      id: "3",
      user: "Нурбек Т.",
      computer: "Standard-24",
      startTime: "14:00",
      endTime: "16:00",
      status: "ending",
    },
    {
      id: "4",
      user: "Эльмира С.",
      computer: "VIP-03",
      startTime: "13:30",
      endTime: "19:30",
      status: "playing",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-white">Активные сессии</h3>
          <p className="text-sm text-gray-400">Играют сейчас</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-green-400">Live</span>
        </div>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {activeSessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-xl flex items-center justify-between group hover:scale-[1.02] transition-transform"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                {session.user.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <p className="text-sm font-bold text-white">{session.user}</p>
                <p className="text-xs text-gray-400">{session.computer}</p>
              </div>
            </div>

            {/* Time */}
            <div className="text-right">
              <p className="text-xs text-gray-400">
                {session.startTime} - {session.endTime}
              </p>
              <div className="mt-1">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    background:
                      session.status === "playing"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(245,158,11,0.15)",
                    color: session.status === "playing" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {session.status === "playing" ? "Играет" : "Заканчивается"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <button
        className="w-full mt-4 py-2.5 rounded-lg text-sm font-bold text-blue-400 transition-all hover:bg-blue-500/10"
        style={{ border: "1px solid rgba(59,130,246,0.2)" }}
      >
        Все сессии →
      </button>
    </div>
  );
}
