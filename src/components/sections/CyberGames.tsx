"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const games = [
  { name: "Counter-Strike 2", genre: "FPS", image: "/Counter-Strike 2 (FPS).jpg", accentColor: "#f97316" },
  { name: "Dota 2", genre: "MOBA", image: "/Dota 2 (MOBA).jpg", accentColor: "#ef4444" },
  { name: "League of Legends", genre: "MOBA", image: "/League of Legends (MOBA).jpg", accentColor: "#facc15" },
  { name: "Fortnite", genre: "Battle Royale", image: "/Fortnite (Battle Royale).jpg", accentColor: "#8b5cf6" },
  { name: "Overwatch 2", genre: "FPS", image: "/Overwatch 2 (FPS).jpg", accentColor: "#f43f5e" },
  { name: "Cyberpunk 2077", genre: "RPG", image: "/Cyberpunk 2077 (RPG).jpg", accentColor: "#fbbf24" },
  { name: "Elden Ring", genre: "RPG", image: "/Elden Ring (RPG).jpg", accentColor: "#fb923c" },
  { name: "Red Dead Redemption 2", genre: "Action", image: "/Red Dead Redemption 2 (Action.jpg", accentColor: "#10b981" },
  { name: "Minecraft", genre: "Sandbox", image: "/Minecraft (Sandbox).jpg", accentColor: "#22c55e" },
  { name: "Valorant", genre: "FPS", image: "/Valorant.png", accentColor: "#ff4655" },
];

export function CyberGames() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { t } = useLanguage();

  return (
    <section id="games" className="py-24 sm:py-28 lg:py-32 relative" style={{ background: "#03030a" }} ref={ref}>
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
              {t("games.tag")}
            </span>
          </div>
          <h2 className="font-black text-white uppercase" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            {t("games.title")}
          </h2>
        </motion.div>

        {/* 3D Carousel для игр */}
        <div className="carousel-3d-wrapper">
          <div className="carousel-3d-inner" style={{ "--quantity": games.length } as React.CSSProperties}>
            {games.map((game, index) => (
              <div
                key={index}
                className="carousel-3d-card"
                style={{ "--index": index } as React.CSSProperties}
              >
                <div className="card-content group">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="250px"
                      quality={85}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, rgba(3,3,10,0.9) 0%, transparent 60%)",
                      }}
                    />
                  </div>
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2"
                    style={{
                      background: `${game.accentColor}25`,
                      border: `1px solid ${game.accentColor}`,
                      color: game.accentColor,
                    }}
                  >
                    {game.genre}
                  </span>
                  <h3 className="text-lg font-black text-white">{game.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .carousel-3d-wrapper {
            width: 100%;
            height: 450px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: visible;
            margin: 0 auto;
          }

          .carousel-3d-inner {
            --w: 280px;
            --h: 360px;
            --translateZ: calc(var(--w) * 1.4);
            position: relative;
            width: var(--w);
            height: var(--h);
            transform-style: preserve-3d;
            animation: rotate3d 40s linear infinite;
          }

          @keyframes rotate3d {
            from {
              transform: perspective(2000px) rotateX(-10deg) rotateY(0deg);
            }
            to {
              transform: perspective(2000px) rotateX(-10deg) rotateY(360deg);
            }
          }

          .carousel-3d-card {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            transform-origin: center;
            transform: rotateY(calc(360deg / var(--quantity) * var(--index))) translateZ(var(--translateZ));
            backface-visibility: hidden;
          }

          .card-content {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(13, 11, 42, 0.95) 0%, rgba(7, 6, 26, 0.95) 100%);
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 16px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
          }

          .carousel-3d-wrapper:hover .carousel-3d-inner {
            animation-play-state: paused;
          }

          @media (max-width: 768px) {
            .carousel-3d-wrapper {
              height: 380px;
            }
            .carousel-3d-inner {
              --w: 240px;
              --h: 320px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
