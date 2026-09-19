"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MonitorIcon, CalendarIcon, ClockIcon, CreditCardIcon, CheckCircleIcon, BuildingIcon } from "@/components/ui/icons";

const steps = [
  {
    num: "01",
    icon: BuildingIcon,
    title: "Клуб",
    subtitle: "Выбери филиал",
    desc: "Бишкек",
    href: "/booking",
  },
  {
    num: "02",
    icon: MonitorIcon,
    title: "ПК",
    subtitle: "Выбери компьютер",
    desc: "из доступных",
    href: "/booking",
  },
  {
    num: "03",
    icon: CalendarIcon,
    title: "Дата",
    subtitle: "Укажи удобную",
    desc: "дату",
    href: "/booking",
  },
  {
    num: "04",
    icon: ClockIcon,
    title: "Время",
    subtitle: "Выбери время",
    desc: "сеанса",
    href: "/booking",
  },
  {
    num: "05",
    icon: CreditCardIcon,
    title: "Оплата",
    subtitle: "Оплати удобным",
    desc: "способом",
    href: "/booking",
  },
  {
    num: "06",
    icon: CheckCircleIcon,
    title: "Готово!",
    subtitle: "Бронирование",
    desc: "подтверждено",
    href: "/booking",
  },
];

export function RoninBookingFlow() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="booking-flow"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#03030a" }}
      ref={ref}
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.25), transparent)" }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-10"
              style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "#3b82f6" }}
            >
              Онлайн-бронирование
            </span>
            <div
              className="h-px w-10"
              style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }}
            />
          </div>

          <h2
            className="font-black uppercase leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            <span className="text-white">ЗАБРОНИРУЙ ПК </span>
            <span
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ЗА 2 МИНУТЫ
            </span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Быстро. Удобно. Без лишних действий.
            Выбери компьютер, время и наслаждайся игрой.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            return (
              <motion.a
                key={i}
                href={step.href}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-sweep group relative rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{
                  background: isLast
                    ? "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))"
                    : "linear-gradient(135deg, #080818, #0a0a1f)",
                  border: isLast
                    ? "1px solid rgba(99,102,241,0.5)"
                    : "1px solid rgba(59,130,246,0.15)",
                  boxShadow: isLast ? "0 0 24px rgba(99,102,241,0.2)" : "none",
                }}
              >
                {/* Step number */}
                <span
                  className="text-xs font-black mb-3 tracking-widest"
                  style={{ color: "rgba(59,130,246,0.4)" }}
                >
                  {step.num}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: isLast
                      ? "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(124,58,237,0.3))"
                      : "rgba(59,130,246,0.08)",
                    border: isLast
                      ? "1px solid rgba(99,102,241,0.5)"
                      : "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isLast ? "#a78bfa" : "#3b82f6" }}
                  />
                </div>

                {/* Text */}
                <h3 className="text-white font-black text-base mb-0.5">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-snug">{step.subtitle}</p>
                <p className="text-gray-600 text-xs">{step.desc}</p>

                {/* Connector line — except last */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                    <svg
                      className="w-3 h-3"
                      style={{ color: "rgba(59,130,246,0.3)" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.4)" }}
                />
              </motion.a>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/booking"
            className="inline-flex items-center gap-3 px-12 py-4 rounded-xl font-black uppercase tracking-wider text-white text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #1d4ed8, #7c3aed)",
              boxShadow: "0 0 32px rgba(99,102,241,0.45)",
            }}
          >
            <CalendarIcon className="w-5 h-5" />
            Забронировать
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="text-gray-600 text-xs text-center">
            Требуется регистрация. Оплата онлайн.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
