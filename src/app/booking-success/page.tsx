"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FullPageLoader } from "@/components/ui/RollingLoader";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Create receipt content
    const receipt = `
═══════════════════════════════
       RONIN GAMING CLUB
═══════════════════════════════

ЧЕК БРОНИРОВАНИЯ

Номер: ${booking.bookingNumber}
Код: ${booking.bookingCode}

Компьютер: #${booking.computer.number}
Категория: ${booking.computer.category.name}
Тариф: ${booking.tariff.name}

Дата: ${new Date(booking.startAt).toLocaleDateString("ru-RU")}
Начало: ${new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
Окончание: ${new Date(booking.endAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
Длительность: ${booking.durationMinutes} мин

Сумма: ${booking.price} с
Статус: Оплачено

═══════════════════════════════
Спасибо за выбор RONIN!
═══════════════════════════════
    `;

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RONIN-${booking.bookingCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Мое бронирование в RONIN Gaming Club\n\nКод: ${booking.bookingCode}\nКомпьютер: #${booking.computer.number}\nДата: ${new Date(booking.startAt).toLocaleDateString("ru-RU")}\nВремя: ${new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Бронирование RONIN",
          text,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("Информация скопирована в буфер обмена!");
    }
  };

  const handleView = () => {
    router.push("/archive");
  };

  if (loading) {
    return <FullPageLoader text="Загрузка чека..." />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Бронирование не найдено</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      {/* Background effects */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 0 40px rgba(16,185,129,0.5)",
            }}
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-2"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              background: "linear-gradient(90deg, #10b981, #059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Бронирование успешно!
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm">
            Твой чек готов. Покажи код бронирования менеджеру.
          </p>
        </motion.div>

        {/* Receipt card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden mb-6 max-w-md mx-auto"
          style={{
            backgroundImage: "url('/чек фон.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="p-4 sm:p-6 backdrop-blur-sm" style={{ background: "rgba(3,3,10,0.85)" }}>
            {/* Booking code */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-xs mb-2">Код бронирования</p>
              <p
                className="font-black text-4xl tracking-wider mb-1"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {booking.bookingCode}
              </p>
              <p className="text-gray-500 text-xs">Номер: {booking.bookingNumber}</p>
            </div>

            <div className="h-px bg-white/10 mb-4" />

            {/* Booking details */}
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Компьютер</p>
                  <p className="text-white font-bold">#{booking.computer.number}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Категория</p>
                  <p className="text-white font-bold">{booking.computer.category.name}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Тариф</p>
                <p className="text-white font-bold">{booking.tariff.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Дата</p>
                  <p className="text-white font-bold">
                    {new Date(booking.startAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Время</p>
                  <p className="text-white font-bold">
                    {new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(booking.endAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Длительность</p>
                  <p className="text-white font-bold">{booking.durationMinutes} минут</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Оплачено</p>
                  <p className="text-green-400 font-bold text-lg">{booking.price} с</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 border-t border-white/10">
            <button
              onClick={handleView}
              className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-white/5"
            >
              <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-white text-xs font-bold">Смотреть</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-white/5 border-x border-white/10"
            >
              <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="text-white text-xs font-bold">Скачать</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-white/5"
            >
              <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="text-white text-xs font-bold">Отправить</span>
            </button>
          </div>
        </motion.div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            На главную
          </button>
          <button
            onClick={() => router.push("/booking")}
            className="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
            style={{
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
            }}
          >
            Новое бронирование
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<FullPageLoader text="Загрузка..." />}>
      <BookingSuccessContent />
    </Suspense>
  );
}
