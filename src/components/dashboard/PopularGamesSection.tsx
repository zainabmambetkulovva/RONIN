"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Game {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

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
  {
    id: "6",
    name: "Overwatch 2",
    imageUrl: "/Overwatch 2 (FPS).jpg",
    category: "FPS",
    color: "#f99e1a",
  },
  {
    id: "7",
    name: "Fortnite",
    imageUrl: "/Fortnite (Battle Royale).jpg",
    category: "Battle Royale",
    color: "#00d9ff",
  },
  {
    id: "8",
    name: "Minecraft",
    imageUrl: "/Minecraft (Sandbox).jpg",
    category: "Sandbox",
    color: "#8cc63f",
  },
  {
    id: "9",
    name: "Cyberpunk 2077",
    imageUrl: "/Cyberpunk 2077 (RPG).jpg",
    category: "RPG",
    color: "#fcee09",
  },
  {
    id: "10",
    name: "Elden Ring",
    imageUrl: "/Elden Ring (RPG).jpg",
    category: "RPG",
    color: "#d4af37",
  },
];

export function PopularGamesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovering) return;

    const autoScroll = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      // If reached end, go back to start
      if (currentScroll >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll right slowly
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 30); // 30ms interval for smooth scrolling

    return () => clearInterval(autoScroll);
  }, [isHovering]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({ left: newPosition, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-white font-black text-2xl sm:text-3xl mb-1">
            Популярные игры 2026
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Самые популярные игры в RONIN
          </p>
        </div>

        {/* Navigation arrows for desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft
                ? "hover:scale-110"
                : "opacity-30 cursor-not-allowed"
            }`}
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              canScrollRight
                ? "hover:scale-110"
                : "opacity-30 cursor-not-allowed"
            }`}
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Games carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
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
                width: "200px",
                height: "280px",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {/* Game image */}
              <img 
                src={game.imageUrl} 
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback если изображение не загрузилось
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Fallback background */}
              <div
                className="absolute inset-0 flex items-center justify-center text-6xl font-black"
                style={{
                  background: `linear-gradient(135deg, ${game.color}33, ${game.color}11)`,
                  zIndex: -1,
                }}
              >
                <span style={{ color: game.color, opacity: 0.3 }}>
                  {game.name.charAt(0)}
                </span>
              </div>

              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(3,3,10,0.95) 0%, transparent 60%)",
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div
                  className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2"
                  style={{
                    background: `${game.color}22`,
                    color: game.color,
                    border: `1px solid ${game.color}44`,
                  }}
                >
                  {game.category}
                </div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {game.name}
                </h3>
              </div>

              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"
                style={{ background: game.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* Gradient fade edges */}
        {canScrollLeft && (
          <div
            className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none hidden md:block"
            style={{
              background: "linear-gradient(to right, #03030a, transparent)",
            }}
          />
        )}
        {canScrollRight && (
          <div
            className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none hidden md:block"
            style={{
              background: "linear-gradient(to left, #03030a, transparent)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
