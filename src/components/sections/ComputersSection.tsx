"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const categories = [
  {
    name: "Standard",
    count: 40,
    price: "120 сом/час",
    specs: ["Intel Core i5-12400F", "GTX 1660 Super", "16GB RAM", "144Hz"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Comfort",
    count: 30,
    price: "150 сом/час",
    specs: ["Intel Core i7-12700F", "RTX 3060", "32GB RAM", "165Hz"],
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Premium",
    count: 20,
    price: "200 сом/час",
    specs: ["Intel Core i9-13900K", "RTX 4080", "64GB RAM", "240Hz 4K"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Ronin Rooms",
    count: 6,
    price: "500 сом/час",
    specs: ["Intel Core i9-13900KS", "RTX 4090", "64GB RAM", "Приватная комната"],
    color: "from-pink-500 to-red-500",
  },
];

export function ComputersSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="computers" ref={ref} className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-ronin-dark via-ronin-purple/10 to-ronin-dark" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ronin-neon/30 bg-ronin-neon/10 mb-6">
            <span className="text-xs font-bold text-ronin-neon uppercase tracking-widest">
              Наши компьютеры
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="ronin-gradient-text">Выбери свой уровень</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            96 мощных ПК в 4 категориях — от комфорта до максимальной производительности
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="glass-card group hover:border-ronin-neon/60 transition-all duration-300 hover:shadow-neon overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${cat.color}`} />

              <div className="p-6 space-y-4">
                {/* Category name */}
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count} компьютеров</p>
                </div>

                {/* Price */}
                <div className="text-3xl font-black">
                  <span className="ronin-gradient-text">{cat.price.split(' ')[0]}</span>
                  <span className="text-gray-500 text-lg ml-1">{cat.price.split(' ')[1]}</span>
                </div>

                {/* Specs */}
                <ul className="space-y-2 border-t border-ronin-neon/10 pt-4">
                  {cat.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-ronin-neon mt-0.5">▹</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button className="w-full py-3 rounded-lg font-bold uppercase tracking-wider border border-ronin-neon/40 hover:bg-ronin-neon/10 hover:border-ronin-neon transition-all text-sm">
                  Забронировать
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
