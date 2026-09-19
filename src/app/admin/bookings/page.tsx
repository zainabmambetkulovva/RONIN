export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Бронирования</h1>
        <p className="text-gray-400">Live view активных сессий и бронирований</p>
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Страница в разработке</h3>
        <p className="text-gray-400">Real-time мониторинг бронирований будет добавлен далее</p>
      </div>
    </div>
  );
}
