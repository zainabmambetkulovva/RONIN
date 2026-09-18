"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const bookingSteps = [
  {
    number: "01",
    title: "Клуб",
    subtitle: "Выбери филиал",
    description: "(Бишкек)",
    icon: "🏢"
  },
  {
    number: "02",
    title: "ПК",
    subtitle: "Выбери компьютер",
    description: "из доступных",
    icon: "💻"
  },
  {
    number: "03",
    title: "Дата",
    subtitle: "Укажи удобную",
    description: "дату",
    icon: "📅"
  },
  {
    number: "04",
    title: "Время",
    subtitle: "Выбери время",
    description: "сеанса",
    icon: "🕐"
  },
  {
    number: "05",
    title: "Оплата",
    subtitle: "Оплати удобным",
    description: "способом",
    icon: "💳"
  },
  {
    number: "06",
    title: "Готово!",
    subtitle: "Бронирование",
    description: "успешно",
    icon: "✓"
  },
];

export function BookingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="booking" className="py-20 relative overflow-hidden">
      {/* Background with blur */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images%20(5).jpg)',
            filter: 'blur(15px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ronin-black/90 via-ronin-black/95 to-ronin-black" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold mb-6 uppercase tracking-wider">
            ОНЛАЙН-БРОНИРОВАНИЕ
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-white">ЗАБРОНИРУЙ ПК</span>
            <br />
            <span className="text-purple-400">ЗА 2 МИНУТЫ</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Быстро. Удобно. Без лишних действий.<br/>
            Выбери компьютер, время и наслаждайся игрой.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto mb-12">
          {bookingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a1a3e]/80 to-ronin-black/60 border border-purple-500/20 hover:border-ronin-neon/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 text-center h-full flex flex-col">
                {/* Icon/Emoji */}
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Number badge */}
                <div className="text-purple-400/50 font-black text-sm mb-2">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white mb-1">{step.title}</h3>
                <p className="text-sm text-gray-300 font-medium mb-1">{step.subtitle}</p>
                <p className="text-xs text-gray-500">{step.description}</p>

                {/* Arrow connector (except last item) */}
                {index < bookingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                    <svg className="w-4 h-4 text-purple-500/40" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-ronin-neon/0 group-hover:from-purple-500/10 group-hover:to-ronin-neon/10 transition-all duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <button className="group relative px-12 py-4 rounded-xl font-black text-lg uppercase tracking-wider overflow-hidden transition-all hover:scale-105">
            {/* Calendar icon */}
            <span className="inline-flex items-center gap-3 relative z-10">
              <span className="text-2xl">📅</span>
              <span>ЗАБРОНИРОВАТЬ</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-ronin-neon to-blue-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-ronin-neon to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
