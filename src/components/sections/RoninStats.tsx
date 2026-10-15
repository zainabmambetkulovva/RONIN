"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { Trophy, Users, Clock, ArrowRight, Zap } from "lucide-react";

// Tournament-style PC categories с ценами
const pcCategories = [
  {
    name: "Standard",
    count: 40,
    badge: "БАЗОВЫЙ",
    status: "LIVE",
    cpu: "Intel Core i5-12400F",
    gpu: "GTX 1660 Super",
    hz: "144Hz",
    price: "80",
    image: "/images (1).jpg",
    color: "#3b82f6",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    name: "Comfort",
    count: 30,
    badge: "ПОПУЛЯРНЫЙ",
    status: "TRENDING",
    cpu: "Intel Core i7-12700F",
    gpu: "RTX 3060 12GB",
    hz: "165Hz",
    price: "120",
    image: "/images (2).jpg",
    color: "#6366f1",
    gradient: "from-indigo-600 to-indigo-800",
  },
  {
    name: "Premium",
    count: 20,
    badge: "ТОП",
    status: "HOT",
    cpu: "Intel Core i9-13900K",
    gpu: "RTX 4080 16GB",
    hz: "240Hz 4K",
    price: "180",
    image: "/images (4).jpg",
    color: "#8b5cf6",
    gradient: "from-purple-600 to-purple-800",
  },
  {
    name: "Ronin Rooms",
    count: 6,
    badge: "VIP",
    status: "EXCLUSIVE",
    cpu: "Intel Core i9-13900KS",
    gpu: "RTX 4090 24GB",
    hz: "165Hz Ultrawide",
    price: "250",
    image: "/images (3).jpg",
    color: "#a855f7",
    gradient: "from-fuchsia-600 to-fuchsia-800",
  },
];

export function RoninStats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();

  return (
    <section
      id="computers"
      className="py-12 relative overflow-hidden"
      ref={ref}
    >
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - E PLAY style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-purple-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
                  Наши компьютеры
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
                Выбери свой уровень
              </h2>
            </div>
            <a 
              href="#tariffs"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <span className="font-bold">Посмотреть все тарифы</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* PC Cards Grid - Tournament style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pcCategories.map((pc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Tournament Card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                
                {/* Status badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${pc.gradient} text-white text-xs font-black uppercase tracking-wider flex items-center gap-1`}>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {pc.status}
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pc.image}
                    alt={pc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                  
                  {/* Badge on image */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
                      {pc.badge}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title & Count */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">{pc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{pc.count} ПК доступно</span>
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">CPU</span>
                      <span className="text-white font-medium">{pc.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">GPU</span>
                      <span className="text-white font-medium">{pc.gpu}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Монитор</span>
                      <span className="text-white font-medium">{pc.hz}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-800" />

                  {/* Price */}
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Цена</div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={`text-4xl font-black bg-gradient-to-r ${pc.gradient} bg-clip-text text-transparent`}>
                        {pc.price}
                      </span>
                      <span className="text-sm text-gray-400">сом/час</span>
                    </div>
                  </div>

                  {/* Book button - FULL WIDTH at bottom */}
                  <motion.a
                    href="/booking"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`block w-full py-3 rounded-xl bg-gradient-to-r ${pc.gradient} text-white font-bold text-sm uppercase tracking-wider text-center hover:shadow-lg hover:shadow-purple-500/50 transition-all`}
                  >
                    Забронировать →
                  </motion.a>

                  {/* Additional info */}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Мгновенный старт</span>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-r ${pc.gradient} opacity-10 blur-xl`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - E PLAY style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-6 rounded-2xl glass-card">
            <div className="text-left">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Готов играть?</div>
              <div className="text-2xl font-black text-white">Зарегистрируйся и получи скидку 20%</div>
            </div>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all whitespace-nowrap"
            >
              Начать сейчас
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
