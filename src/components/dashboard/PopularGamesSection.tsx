"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";

const GAMES_2026 = [
  {
    id: "1",
    name: "Counter-Strike 2",
    imageUrl: "/Counter-Strike 2 (FPS).jpg",
    category: "FPS",
    color: "#ff9500",
  },
  {
    id: "2",
    name: "Dota 2",
    imageUrl: "/Dota 2 (MOBA).jpg",
    category: "MOBA",
    color: "#e62020",
  },
  {
    id: "3",
    name: "Valorant",
    imageUrl: "/Valorant.png",
    category: "FPS",
    color: "#ff4655",
  },
  {
    id: "4",
    name: "League of Legends",
    imageUrl: "/League of Legends (MOBA).jpg",
    category: "MOBA",
    color: "#c89b3c",
  },
  {
    id: "5",
    name: "Apex Legends",
    imageUrl: "/Apex Legends.png",
    category: "Battle Royale",
    color: "#da292e",
  },
];

export function PopularGamesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovering) return;

    const autoScroll = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      if (currentScroll >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 50); // Увеличено с 30ms до 50ms для более медленной прокрутки

    return () => clearInterval(autoScroll);
  }, [isHovering]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-6 h-6 text-purple-400" />
        <h2 className="text-white font-black text-2xl sm:text-3xl">
          Популярные игры
        </h2>
      </div>

      {/* Games carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {GAMES_2026.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                width: "220px",
                height: "300px",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {/* Game image */}
              <div className="absolute inset-0">
                <Image 
                  src={game.imageUrl} 
                  alt={game.name}
                  fill
                  sizes="220px"
                  quality={95}
                  className="object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div
                  className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2"
                  style={{
                    background: `${game.color}33`,
                    color: game.color,
                    border: `1px solid ${game.color}`,
                  }}
                >
                  {game.category}
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {game.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
