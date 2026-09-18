"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";

const trendingGames = [
  {
    id: 1,
    title: "Counter-Strike 2",
    players: "12,500+ игроков",
    category: "FPS",
    gradient: "from-orange-600 to-red-600"
  },
  {
    id: 2,
    title: "Dota 2",
    players: "11,200+ игроков",
    category: "MOBA",
    gradient: "from-red-600 to-purple-600"
  },
  {
    id: 3,
    title: "GTA V",
    players: "10,800+ игроков",
    category: "Action",
    gradient: "from-green-600 to-blue-600"
  },
  {
    id: 4,
    title: "Valorant",
    players: "9,500+ игроков",
    category: "Tactical Shooter",
    gradient: "from-red-500 to-pink-500"
  },
  {
    id: 5,
    title: "Apex Legends",
    players: "8,900+ игроков",
    category: "Battle Royale",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    title: "Elden Ring",
    players: "7,600+ игроков",
    category: "Action RPG",
    gradient: "from-yellow-600 to-orange-600"
  },
  {
    id: 7,
    title: "Cyberpunk 2077",
    players: "7,200+ игроков",
    category: "RPG",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    id: 8,
    title: "Black Myth: Wukong",
    players: "6,800+ игроков",
    category: "Action RPG",
    gradient: "from-amber-600 to-red-700"
  },
];

export function TrendingGamesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingGames.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % trendingGames.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + trendingGames.length) % trendingGames.length);
  };

  return (
    <section id="games" className="py-20 relative overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images%20(4).jpg)',
            filter: 'blur(12px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ronin-black/85 via-ronin-black/90 to-ronin-black/95" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-purple-400">Во что играют</span>{" "}
            <span className="text-ronin-neon">в RONIN</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Самые популярные игры на наших компьютерах
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
            {trendingGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={false}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  scale: index === currentIndex ? 1 : 0.95,
                  zIndex: index === currentIndex ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative w-full h-full group">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />
                  
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }} />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ronin-black via-ronin-black/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 20 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Gamepad2 className="w-16 h-16 text-white/80 mx-auto mb-4" />
                      <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold mb-4 uppercase">
                        {game.category}
                      </span>
                      <h3 className="text-4xl md:text-5xl font-black text-white mb-3">
                        {game.title}
                      </h3>
                      <p className="text-white/90 text-lg flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {game.players}
                      </p>
                    </motion.div>
                  </div>

                  {/* Neon border effect */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 rounded-2xl"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-ronin-black/80 backdrop-blur-sm border border-ronin-neon/30 hover:border-ronin-neon flex items-center justify-center transition-all hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-ronin-neon" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-ronin-black/80 backdrop-blur-sm border border-ronin-neon/30 hover:border-ronin-neon flex items-center justify-center transition-all hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6 text-ronin-neon" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {trendingGames.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-ronin-neon w-8"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
