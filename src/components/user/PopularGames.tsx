"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";

const games2026 = [
  { id: 1, name: "Counter-Strike 2", image: "/Counter-Strike 2 (FPS).jpg" },
  { id: 2, name: "Dota 2", image: "/Dota 2 (MOBA).jpg" },
  { id: 3, name: "League of Legends", image: "/League of Legends (MOBA).jpg" },
  { id: 4, name: "Fortnite", image: "/Fortnite (Battle Royale).jpg" },
  { id: 5, name: "Overwatch 2", image: "/Overwatch 2 (FPS).jpg" },
  { id: 6, name: "Cyberpunk 2077", image: "/Cyberpunk 2077 (RPG).jpg" },
  { id: 7, name: "Elden Ring", image: "/Elden Ring (RPG).jpg" },
  { id: 8, name: "Minecraft", image: "/Minecraft (Sandbox).jpg" },
];

export function PopularGames() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-8 h-8" style={{ color: "#8b5cf6" }} />
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          Популярные игры 2026
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {games2026.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative rounded-xl overflow-hidden cursor-pointer"
            style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <div className="relative h-48">
              <Image src={game.image} alt={game.name} fill className="object-cover transition-transform group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)" }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-black text-white">{game.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
