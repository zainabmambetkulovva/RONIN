"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RollingLoader } from "@/components/ui/RollingLoader";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Tariff {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  type: string;
}

interface Computer {
  id: string;
  number: number;
  status: string;
}

export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [computers, setComputers] = useState<Computer[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    tariffId: "",
    date: "",
    time: "",
    computerId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchTariffs(formData.categoryId);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    if (formData.categoryId && formData.date && formData.time) {
      fetchAvailableComputers();
    }
  }, [formData.categoryId, formData.date, formData.time]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTariffs = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/tariffs?categoryId=${categoryId}`);
      const data = await response.json();
      setTariffs(data.tariffs || []);
    } catch (error) {
      console.error("Failed to fetch tariffs:", error);
    }
  };

  const fetchAvailableComputers = async () => {
    try {
      const response = await fetch(
        `/api/computers?categoryId=${formData.categoryId}&date=${formData.date}&time=${formData.time}`
      );
      const data = await response.json();
      setComputers(data.computers || []);
    } catch (error) {
      console.error("Failed to fetch computers:", error);
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Введите ваше имя";
      }
      if (!formData.categoryId) {
        newErrors.categoryId = "Выберите категорию";
      }
      if (!formData.tariffId) {
        newErrors.tariffId = "Выберите тариф";
      }
    }

    if (stepNumber === 2) {
      if (!formData.date) {
        newErrors.date = "Выберите дату";
      }
      if (!formData.time) {
        newErrors.time = "Выберите время";
      }
    }

    if (stepNumber === 3) {
      if (!formData.computerId) {
        newErrors.computerId = "Выберите компьютер";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      // Prepare data for API
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const bookingPayload = {
        computerId: formData.computerId,
        tariffId: formData.tariffId,
        startAt: startDateTime.toISOString(),
      };

      console.log("📤 Sending booking request:", bookingPayload);

      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const bookingData = await bookingResponse.json();

      console.log("🔍 Booking Response:", bookingData); // Debug log

      if (!bookingResponse.ok) {
        console.error("❌ Booking creation failed:", bookingData);
        setErrors({ submit: bookingData.error || "Ошибка создания бронирования" });
        setSubmitting(false);
        return;
      }

      if (!bookingData.booking || !bookingData.booking.id) {
        console.error("❌ Booking ID missing:", bookingData);
        setErrors({ submit: "Не получен ID бронирования" });
        setSubmitting(false);
        return;
      }

      console.log("✅ Booking created with ID:", bookingData.booking.id);

      // Create payment automatically (skip payment page)
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          method: "cash", // Default payment method for testing
        }),
      });

      if (paymentResponse.ok) {
        console.log("✅ Redirecting to success page with booking ID:", bookingData.booking.id);
        // Redirect directly to success page with receipt
        router.push(`/booking-success?bookingId=${bookingData.booking.id}`);
      } else {
        const paymentError = await paymentResponse.json();
        console.error("❌ Payment failed:", paymentError);
        setErrors({ submit: "Ошибка оплаты" });
      }
    } catch (error) {
      console.error("❌ Failed to create booking:", error);
      setErrors({ submit: "Ошибка сети" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RollingLoader />
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s <= step
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-16 sm:w-24 mx-2 transition-all ${
                    s < step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            {step === 1 && "Шаг 1: Выберите категорию и тариф"}
            {step === 2 && "Шаг 2: Выберите дату и время"}
            {step === 3 && "Шаг 3: Выберите компьютер"}
          </p>
        </div>
      </div>

      {/* Form content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        {/* Step 1: Name, Category, Tariff */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                Ваше имя <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ borderColor: errors.name ? "#ef4444" : "rgba(59,130,246,0.3)" }}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-bold mb-3 text-sm sm:text-base">
                Категория ПК <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFormData({ ...formData, categoryId: category.id, tariffId: "" })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      formData.categoryId === category.id
                        ? "ring-2 ring-blue-500 bg-blue-500/20"
                        : "bg-white/5 border border-white/10 hover:border-blue-400/50"
                    }`}
                  >
                    <h3 className="text-white font-bold mb-1">{category.name}</h3>
                    <p className="text-gray-400 text-xs">{category.description}</p>
                  </button>
                ))}
              </div>
              {errors.categoryId && <p className="text-red-400 text-sm mt-2">{errors.categoryId}</p>}
            </div>

            {/* Tariffs */}
            {formData.categoryId && (
              <div>
                <label className="block text-white font-bold mb-3 text-sm sm:text-base">
                  Тариф <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {tariffs.map((tariff) => (
                    <button
                      key={tariff.id}
                      onClick={() => setFormData({ ...formData, tariffId: tariff.id })}
                      className={`p-4 rounded-xl flex items-center justify-between transition-all ${
                        formData.tariffId === tariff.id
                          ? "ring-2 ring-blue-500 bg-blue-500/20"
                          : "bg-white/5 border border-white/10 hover:border-blue-400/50"
                      }`}
                    >
                      <div className="text-left">
                        <h3 className="text-white font-bold">{tariff.name}</h3>
                        <p className="text-gray-400 text-sm">{tariff.durationMinutes} минут</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-black text-xl">{tariff.price} сом</p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.tariffId && <p className="text-red-400 text-sm mt-2">{errors.tariffId}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                Дата <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={`${new Date().getFullYear()}-01-01`}
                max={`${new Date().getFullYear()}-12-31`}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ borderColor: errors.date ? "#ef4444" : "rgba(59,130,246,0.3)" }}
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                Время <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ borderColor: errors.time ? "#ef4444" : "rgba(59,130,246,0.3)" }}
              />
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Computer Selection */}
        {step === 3 && (
          <div>
            <label className="block text-white font-bold mb-3 text-sm sm:text-base">
              Выберите компьютер <span className="text-red-400">*</span>
            </label>
            {computers.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-gray-400 mb-2">Нет доступных компьютеров</p>
                <p className="text-gray-500 text-sm">Попробуйте выбрать другое время</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {computers.map((computer) => (
                  <button
                    key={computer.id}
                    onClick={() => setFormData({ ...formData, computerId: computer.id })}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                      formData.computerId === computer.id
                        ? "ring-2 ring-blue-500 bg-blue-500/20"
                        : "bg-white/5 border border-white/10 hover:border-blue-400/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-2">
                      <span className="text-white font-black text-lg">{computer.number}</span>
                    </div>
                    <p className="text-white font-bold text-sm">ПК #{computer.number}</p>
                  </button>
                ))}
              </div>
            )}
            {errors.computerId && <p className="text-red-400 text-sm mt-2">{errors.computerId}</p>}
          </div>
        )}

        {errors.submit && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-center">{errors.submit}</p>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 text-sm sm:text-base"
            style={{
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
            }}
          >
            Назад
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105 text-sm sm:text-base"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            Далее
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            }}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Создание...
              </span>
            ) : (
              "К оплате"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
