"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Gamepad2, ArrowRight, Users, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

const games = [
  { 
    name: "Counter-Strike 2", 
    genre: "FPS", 
    image: "/Counter-Strike 2 (FPS).jpg", 
    players: "15M+", 
    status: "LIVE",
    color: "from-orange-600 to-red-600" 
  },
  { 
    name: "Dota 2", 
    genre: "MOBA", 
    image: "/Dota 2 (MOBA).jpg", 
    players: "12M+", 
    status: "TRENDING",
    color: "from-red-600 to-pink-600" 
  },
  { 
    name: "League of Legends", 
    genre: "MOBA", 
    image: "/League of Legends (MOBA).jpg", 
    players: "20M+", 
    status: "HOT",
    color: "from-yellow-600 to-orange-600" 
  },
  { 
    name: "Fortnite", 
    genre: "Battle Royale", 
    image: "/Fortnite (Battle Royale).jpg", 
    players: "8M+", 
    status: "LIVE",
    color: "from-purple-600 to-pink-600" 
  },
  { 
    name: "Overwatch 2", 
    genre: "FPS", 
    image: "/Overwatch 2 (FPS).jpg", 
    players: "6M+", 
    status: "TRENDING",
    color: "from-pink-600 to-rose-600" 
  },
  { 
    name: "Cyberpunk 2077", 
    genre: "RPG", 
    image: "/Cyberpunk 2077 (RPG).jpg", 
    players: "4M+", 
    status: "EXCLUSIVE",
    color: "from-yellow-600 to-amber-600" 
  },
  { 
    name: "Valorant", 
    genre: "FPS", 
    image: "/Valorant.png", 
    players: "18M+", 
    status: "HOT",
    color: "from-red-600 to-pink-600" 
  },
  { 
    name: "Apex Legends", 
    genre: "Battle Royale", 
    image: "/Apex Legends.png", 
    players: "10M+", 
    status: "LIVE",
    color: "from-red-600 to-orange-600" 
  },
];

const statusStyles = {
  LIVE: "bg-green-500/20 text-green-400 border-green-500",
  TRENDING: "bg-purple-500/20 text-purple-400 border-purple-500",
  HOT: "bg-orange-500/20 text-orange-400 border-orange-500",
  EXCLUSIVE: "bg-blue-500/20 text-blue-400 border-blue-500",
};

export function CyberGames() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Infinite scroll - no manual controls needed
  return (
    <section 
      id="games" 
      className="py-12 relative overflow-hidden" 
      ref={ref}
    >
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
              {t("games.tag") || "Gaming Library"}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
            <span className="block text-white">{t("games.title1")}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t("games.title")}
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("games.description") || "Все популярные игры уже установлены на наших компьютерах"}
          </p>
        </motion.div>

        {/* Games Grid - Infinite Scroll Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: isPaused ? undefined : [0, -100 * games.length + '%']
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: games.length * 10,  // 8 games × 10s = 80s (slower)
                  ease: "linear"
                }
              }}
            >
              {/* Duplicate games for seamless loop */}
              {[...games, ...games].map((game, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * (i % 4) }}
                  className="group relative flex-shrink-0 w-[280px]"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                    
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={game.image}
                        alt={game.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={85}
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                      
                      {/* Status badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm border ${statusStyles[game.status as keyof typeof statusStyles]}`}>
                          {game.status}
                        </span>
                      </div>

                      {/* Players count */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                        <Users className="w-3 h-3 text-gray-300" />
                        <span className="text-xs font-bold text-gray-300">{game.players}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                        <span className={`text-xs font-black uppercase tracking-wider bg-gradient-to-r ${game.color} bg-clip-text text-transparent`}>
                          {game.genre}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                        {game.name}
                      </h3>

                      {/* Play button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                      >
                        <Trophy className="w-4 h-4" />
                        {t("games.play") || "Играть"}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            {t("games.more") || "И многие другие игры уже установлены!"}
          </p>
          <motion.a
            href="#booking-flow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm text-white font-bold uppercase tracking-wider border-2 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
          >
            Забронировать
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
