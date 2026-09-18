"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { value: "96", suffix: "", label: "Компьютеров", desc: "4 категории на выбор", color: "#3b82f6" },
  { value: "24", suffix: "/7", label: "Без выходных", desc: "Работаем круглосуточно", color: "#8b5cf6" },
  { value: "4", suffix: "", label: "Категории ПК", desc: "Standard → Ronin Rooms", color: "#60a5fa" },
  { value: "240", suffix: "Hz", label: "Макс. частота", desc: "На Premium станциях", color: "#a78bfa" },
];

// Без цен — только характеристики
const categories = [
  {
    name: "Standard",
    count: 40,
    badge: "Старт",
    cpu: "Intel Core i5-12400F",
    gpu: "GTX 1660 Super",
    hz: "144Hz",
    color: "#3b82f6",
  },
  {
    name: "Comfort",
    count: 30,
    badge: "Популярный",
    cpu: "Intel Core i7-12700F",
    gpu: "RTX 3060 12GB",
    hz: "165Hz",
    color: "#6366f1",
  },
  {
    name: "Premium",
    count: 20,
    badge: "Топ",
    cpu: "Intel Core i9-13900K",
    gpu: "RTX 4080 16GB",
    hz: "240Hz 4K",
    color: "#8b5cf6",
  },
  {
    name: "Ronin Rooms",
    count: 6,
    badge: "VIP",
    cpu: "Intel Core i9-13900KS",
    gpu: "RTX 4090 24GB",
    hz: "165Hz Ultrawide",
    color: "#a855f7",
  },
];

export function RoninStats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      id="computers"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#03030a" }}
      ref={ref}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#60a5fa" }}>
              Наши компьютеры
            </span>
          </div>
          <h2
            className="font-black text-white uppercase"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            96 станций. 4 уровня
          </h2>
          <p className="text-gray-300 text-base mt-2 max-w-lg">
            От комфортного Standard до топового Ronin Rooms с RTX 4090.
            Зарегистрируйся чтобы узнать тарифы.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-sweep rounded-2xl p-6 text-center group transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #07071a, #0d0d24)",
                border: "1px solid rgba(59,130,246,0.12)",
              }}
            >
              <div
                className="font-black mb-1 leading-none"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  color: s.color,
                  filter: `drop-shadow(0 0 14px ${s.color}77)`,
                }}
              >
                {s.value}
                <span style={{ fontSize: "0.7em" }}>{s.suffix}</span>
              </div>
              <p className="text-white font-bold text-sm mb-1">{s.label}</p>
              <p className="text-gray-400 text-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Category cards — без цен */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
              className="card-sweep group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #07071a 0%, #0d0d24 100%)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              {/* Top color bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />

              <div className="p-5">
                {/* Name + badge (вместо цены) */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-black text-xl">{cat.name}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{cat.count} компьютеров</p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-black uppercase"
                    style={{
                      background: `${cat.color}18`,
                      border: `1px solid ${cat.color}44`,
                      color: cat.color,
                    }}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Specs */}
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: "CPU", val: cat.cpu },
                    { label: "GPU", val: cat.gpu },
                    { label: "Монитор", val: cat.hz },
                  ].map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center gap-2">
                      <span className="text-gray-500 text-xs shrink-0">{spec.label}</span>
                      <span className="text-gray-200 text-xs font-medium text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(cat.count / 96) * 100}%` } : {}}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
                  />
                </div>

                {/* Book button */}
                <a
                  href="/booking"
                  className="block w-full text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] hover:brightness-125"
                  style={{
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}44`,
                    color: cat.color,
                  }}
                >
                  Забронировать
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-10"
        >
          <p className="text-gray-400 text-sm">
            Узнай тарифы после{" "}
            <a href="/register" className="text-blue-400 font-bold hover:underline">
              регистрации
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
