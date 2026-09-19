"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const games = [
  { name: "Counter-Strike 2", genre: "FPS", image: "/images (11).jpg", accentColor: "#f97316" },
  { name: "Dota 2", genre: "MOBA", image: "/images (12).jpg", accentColor: "#ef4444" },
  { name: "Valorant", genre: "Tactical FPS", image: "/images (13).jpg", accentColor: "#f43f5e" },
  { name: "League of Legends", genre: "MOBA", image: "/images (14).jpg", accentColor: "#facc15" },
  { name: "GTA V", genre: "Action", image: "/Без названия (2).jpg", accentColor: "#22c55e" },
  { name: "Cyberpunk 2077", genre: "RPG", image: "/Без названия (3).jpg", accentColor: "#fbbf24" },
  { name: "Apex Legends", genre: "Battle Royale", image: "/Без названия (4).jpg", accentColor: "#fb923c" },
  { name: "Call of Duty", genre: "FPS", image: "/Без названия (5).jpg", accentColor: "#10b981" },
  { name: "Fortnite", genre: "Battle Royale", image: "/Без названия (6).jpg", accentColor: "#8b5cf6" },
  { name: "Minecraft", genre: "Sandbox", image: "/Без названия (7).jpg", accentColor: "#22c55e" },
];

export function CyberGames() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="games" className="py-16 sm:py-20 lg:py-24 relative" style={{ background: "#03030a" }} ref={ref}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#60a5fa" }}>
              В нашем клубе
            </span>
          </div>
          <h2 className="font-black text-white uppercase" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Игры
          </h2>
        </motion.div>

        {/* Grid 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card-sweep group relative rounded-xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: "2 / 3" }}
            >
              {/* Cover image — улучшенное качество */}
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                quality={90}
              />

              {/* Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(3,3,10,0.97) 0%, rgba(3,3,10,0.5) 45%, rgba(3,3,10,0.05) 100%)",
                }}
              />

              {/* Tint on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                style={{ background: game.accentColor }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{
                    background: `${game.accentColor}25`,
                    border: `1px solid ${game.accentColor}55`,
                    color: game.accentColor,
                  }}
                >
                  {game.genre}
                </span>
                <h3 className="text-white font-black text-sm leading-tight">{game.name}</h3>
              </div>

              {/* Neon border hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1.5px ${game.accentColor}99` }}
              />
            </motion.div>
          ))}
        </div>
        {/* Кнопка "Все игры" УДАЛЕНА */}
      </div>
    </section>
  );
}
