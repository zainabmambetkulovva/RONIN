"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Eye } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { FullPageLoader } from "@/components/ui/RollingLoader";
import Image from "next/image";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const receiptRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      console.log("🔍 Fetching booking with ID:", bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      
      console.log("📦 API Response:", data);
      
      if (!response.ok) {
        console.error("❌ API returned error:", data.error);
      }
      
      if (data.booking) {
        console.log("✅ Booking found:", data.booking);
        setBooking(data.booking);
      } else {
        console.error("❌ No booking in response");
      }
    } catch (error) {
      console.error("❌ Failed to fetch booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      // Динамический импорт для уменьшения bundle size
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Создаём canvas из HTML элемента
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#03030a',
        logging: false,
      });

      // Конвертируем canvas в изображение
      const imgData = canvas.toDataURL('image/png');

      // Создаём PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`RONIN-${booking.bookingCode}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ошибка при создании PDF. Попробуйте ещё раз.');
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#03030a',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `RONIN-${booking.bookingCode}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Бронирование RONIN',
              text: `Мое бронирование в RONIN Gaming Club\nКод: ${booking.bookingCode}`,
              files: [file],
            });
          } catch (error) {
            console.log('Share cancelled');
          }
        } else {
          // Fallback для WhatsApp через URL
          const text = encodeURIComponent(
            `Мое бронирование в RONIN Gaming Club\n\nКод: ${booking.bookingCode}\nКомпьютер: #${booking.computer.number}\nДата: ${new Date(booking.startAt).toLocaleDateString("ru-RU")}\nВремя: ${new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`
          );
          window.open(`https://wa.me/?text=${text}`, '_blank');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
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
      <DashboardNavbar />
      {/* Background effects */}
      <div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">На главную</span>
        </button>

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
          ref={receiptRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden mb-6 max-w-md mx-auto"
          style={{
            backgroundImage: "url('/чек фон.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "2px solid rgba(168,85,247,0.5)",
            boxShadow: "0 0 40px rgba(168,85,247,0.3)",
          }}
        >
          <div className="p-6" style={{ background: "rgba(3,3,10,0.85)" }}>
            {/* RONIN Logo Header */}
            <div className="text-center mb-6 pb-6 border-b-2 border-purple-500/30">
              <h2 
                className="text-2xl font-black uppercase mb-1"
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                RONIN
              </h2>
              <p className="text-purple-300 text-xs font-bold uppercase tracking-widest">GAMING CLUB</p>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              {booking.user?.avatar ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500">
                  <Image
                    src={`/avatars/${booking.user.avatar}`}
                    alt={booking.user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                  {booking.user?.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{booking.user?.name || 'Неизвестно'}</p>
                <p className="text-purple-300 text-xs">
                  {new Date(booking.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{' г. '}
                  {new Date(booking.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Booking code - Large and prominent */}
            <div className="text-center mb-6 py-4 rounded-xl" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">Код бронирования</p>
              <p
                className="font-black text-5xl tracking-wider mb-2"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.1em",
                }}
              >
                {booking.bookingCode}
              </p>
              <p className="text-gray-400 text-xs">#{booking.bookingNumber}</p>
            </div>

            {/* Booking details in grid */}
            <div className="space-y-3 text-sm mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-purple-300 text-xs mb-1 font-bold">Компьютер</p>
                  <p className="text-white font-bold text-lg">#{booking.computer.number}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-purple-300 text-xs mb-1 font-bold">Категория</p>
                  <p className="text-white font-bold text-lg">{booking.computer.category.name}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-purple-300 text-xs mb-1 font-bold">Тариф</p>
                <p className="text-white font-bold text-lg">{booking.tariff.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-purple-300 text-xs mb-1 font-bold">Дата</p>
                  <p className="text-white font-bold">
                    {new Date(booking.startAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })} г.
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-purple-300 text-xs mb-1 font-bold">Время</p>
                  <p className="text-white font-bold">
                    {new Date(booking.startAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(booking.endAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-purple-300 text-xs mb-1 font-bold">Длительность</p>
                  <p className="text-white font-bold">{booking.durationMinutes} мин</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <p className="text-green-300 text-xs mb-1 font-bold">Оплачено</p>
                  <p className="text-green-400 font-black text-xl">{booking.price} с</p>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="pt-4 border-t border-purple-500/30 text-center">
              <p className="text-gray-400 text-xs mb-1">г. Бишкек, ул. Горького 130, 2 этаж</p>
              <p className="text-purple-300 text-xs font-bold">+996 501 004 700</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 border-t-2 border-purple-500/30">
            <button
              onClick={handleView}
              className="flex flex-col items-center justify-center py-4 transition-all hover:bg-purple-500/10"
              style={{ borderRight: "1px solid rgba(168,85,247,0.2)" }}
            >
              <Eye className="w-6 h-6 text-purple-400 mb-1" />
              <span className="text-white text-xs font-bold">Смотреть</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center py-4 transition-all hover:bg-purple-500/10"
              style={{ borderRight: "1px solid rgba(168,85,247,0.2)" }}
            >
              <Download className="w-6 h-6 text-purple-400 mb-1" />
              <span className="text-white text-xs font-bold">Скачать</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center py-4 transition-all hover:bg-purple-500/10"
            >
              <Share2 className="w-6 h-6 text-purple-400 mb-1" />
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
