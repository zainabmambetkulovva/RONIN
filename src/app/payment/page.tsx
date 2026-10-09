"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const handlePayment = async () => {
    if (!selectedMethod || !bookingId) return;

    setProcessing(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          method: selectedMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to success page
        router.push(`/booking-success?bookingId=${bookingId}`);
      }
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "mbank",
      name: "M-Bank",
      icon: "💳",
      color: "#e74c3c",
      description: "Оплата через M-Bank",
    },
    {
      id: "o",
      name: "O!",
      icon: "📱",
      color: "#3498db",
      description: "Оплата через O!",
    },
    {
      id: "optima",
      name: "Optima Bank",
      icon: "🏦",
      color: "#f39c12",
      description: "Оплата через Optima",
    },
    {
      id: "bakai",
      name: "Bakai Bank",
      icon: "💰",
      color: "#27ae60",
      description: "Оплата через Bakai",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Бронирование не найдено</p>
          <button
            onClick={() => router.push("/booking")}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Вернуться к бронированию
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#60a5fa" }}>
              Оплата
            </span>
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
          </div>

          <h1
            className="font-black uppercase leading-tight tracking-tighter mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(90deg, #3b82f6, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Выбери способ оплаты
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Оплати бронирование удобным для тебя способом
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h2 className="text-white font-bold text-xl mb-4">Способ оплаты</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <motion.button
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-2xl transition-all duration-300 ${
                    selectedMethod === method.id
                      ? "ring-4 scale-105"
                      : "ring-1 ring-white/10 hover:ring-white/20"
                  }`}
                  style={{
                    background:
                      selectedMethod === method.id
                        ? `linear-gradient(135deg, ${method.color}22, ${method.color}11)`
                        : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                    ringColor: selectedMethod === method.id ? method.color : "transparent",
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${method.color}, ${method.color}cc)`,
                        boxShadow: selectedMethod === method.id ? `0 0 30px ${method.color}66` : "none",
                      }}
                    >
                      {method.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>

                  {/* Selected indicator */}
                  {selectedMethod === method.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: method.color }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Info notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 p-4 rounded-xl"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Примечание:</strong> Это демо-версия системы оплаты. 
                    В реальной версии здесь будет интеграция с платежными системами.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl p-6 sticky top-8"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <h2 className="text-white font-bold text-xl mb-4">Детали заказа</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Компьютер:</span>
                  <span className="text-white font-bold">#{booking.computer.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Категория:</span>
                  <span className="text-white font-bold">{booking.computer.category.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Тариф:</span>
                  <span className="text-white font-bold">{booking.tariff.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Длительность:</span>
                  <span className="text-white font-bold">{booking.durationMinutes} мин</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Дата и время:</span>
                  <span className="text-white font-bold">
                    {new Date(booking.startAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/10 mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 text-lg">Итого:</span>
                <span className="text-white font-black text-2xl">{booking.price} с</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all ${
                  !selectedMethod || processing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
                }`}
                style={{
                  background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
                  boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                }}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Обработка...
                  </span>
                ) : (
                  "Оплатить"
                )}
              </button>

              <button
                onClick={() => router.push("/booking")}
                className="w-full mt-3 py-3 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(59,130,246,0.3)",
                  background: "rgba(59,130,246,0.05)",
                }}
              >
                Отменить
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
