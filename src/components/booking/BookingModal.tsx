"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, DollarSign, Cpu, Monitor, MemoryStick, Keyboard, Mouse } from "lucide-react";
import { useRouter } from "next/navigation";

interface Computer {
  id: string;
  number: number;
  category: {
    id: string;
    name: string;
    description: string;
  };
  specifications: any;
}

interface Tariff {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  type: string;
}

interface Props {
  computer: Computer;
  onClose: () => void;
}

export function BookingModal({ computer, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"specs" | "date" | "tariff">("specs");
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTariffs();
  }, [computer.category.id]);

  const fetchTariffs = async () => {
    try {
      const res = await fetch(`/api/tariffs?categoryId=${computer.category.id}`);
      const data = await res.json();
      setTariffs(data.tariffs || []);
    } catch (error) {
      console.error("Error fetching tariffs:", error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedTariff) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);

    try {
      // Формируем дату и время начала
      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      // 1. Создаем бронирование
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          computerId: computer.id,
          tariffId: selectedTariff.id,
          startAt: startDateTime.toISOString(),
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        alert(bookingData.error || "Ошибка при создании бронирования");
        return;
      }

      // 2. Создаем платеж в Finik (5 сом)
      console.log('Booking created:', bookingData.booking);
      
      const paymentRes = await fetch("/api/finik/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          userId: bookingData.booking.user_id,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        alert(paymentData.error || "Ошибка при создании платежа");
        return;
      }

      // 3. Редирект на страницу оплаты Finik
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        alert("Не удалось получить ссылку на оплату");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Ошибка при создании бронирования");
    } finally {
      setIsLoading(false);
    }
  };

  const specs = computer.specifications;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(7,7,26,0.95), rgba(13,13,36,0.95))",
          border: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "0 0 40px rgba(59,130,246,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-5xl font-black text-blue-400">#{computer.number}</div>
            <div>
              <div className="text-2xl font-black text-white uppercase">{computer.category.name}</div>
              <div className="text-sm text-gray-400">{computer.category.description}</div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {["specs", "date", "tariff"].map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm uppercase transition-all ${
                step === s
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {i + 1}. {s === "specs" ? "Характеристики" : s === "date" ? "Дата/Время" : "Тариф"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {/* Шаг 1: Характеристики */}
          {step === "specs" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <SpecRow icon={<Cpu />} label="Процессор" value={specs.cpu} />
              <SpecRow icon={<Monitor />} label="Видеокарта" value={specs.gpu} />
              <SpecRow icon={<MemoryStick />} label="Оперативная память" value={specs.ram} />
              <SpecRow icon={<Monitor />} label="Монитор" value={specs.monitor} />
              <SpecRow icon={<Keyboard />} label="Клавиатура" value={specs.keyboard} />
              <SpecRow icon={<Mouse />} label="Мышь" value={specs.mouse} />
              {specs.chair && <SpecRow icon={<span>🪑</span>} label="Кресло" value={specs.chair} />}
              {specs.microphone && <SpecRow icon={<span>🎤</span>} label="Микрофон" value={specs.microphone} />}
              {specs.camera && <SpecRow icon={<span>📷</span>} label="Камера" value={specs.camera} />}

              <button
                onClick={() => setStep("date")}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg uppercase hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/30"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* Шаг 2: Дата и время */}
          {step === "date" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-2">
                  <Calendar className="w-5 h-5" />
                  Выберите дату
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  placeholder="ДД.ММ.ГГГГ"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Формат: ДД.ММ.ГГГГ</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-2">
                  <Clock className="w-5 h-5" />
                  Выберите время начала
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  placeholder="--:--"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Пример: 14:30</p>
              </div>

              <button
                onClick={() => setStep("tariff")}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg uppercase hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* Шаг 3: Выбор тарифа */}
          {step === "tariff" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {tariffs.map((tariff) => (
                <button
                  key={tariff.id}
                  onClick={() => setSelectedTariff(tariff)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTariff?.id === tariff.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">{tariff.name}</div>
                      <div className="text-gray-400 text-sm">
                        {Math.floor(tariff.duration_minutes / 60)} ч {tariff.duration_minutes % 60} мин
                      </div>
                    </div>
                    <div className="text-2xl font-black text-blue-400">{tariff.price} сом</div>
                  </div>
                </button>
              ))}

              {/* Кнопка оплаты - ПОКАЗЫВАЕМ СРАЗУ ПОСЛЕ ВЫБОРА */}
              {selectedTariff && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  {/* Итого */}
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="text-white font-bold mb-2">Итого:</div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-300">
                        {selectedTariff.name} на компьютере #{computer.number}
                      </div>
                      <div className="text-3xl font-black text-green-400">{selectedTariff.price} сом</div>
                    </div>
                  </div>

                  {/* ОПЛАТИТЬ - сразу видна */}
                  <button
                    onClick={handleBooking}
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg uppercase hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                  >
                    {isLoading ? "Создание..." : "Оплатить 5 сом"}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Тестовая оплата через Finik Pay
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
      <div className="text-blue-400">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-white font-semibold">{value}</div>
      </div>
    </div>
  );
}
