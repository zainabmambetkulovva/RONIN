"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const games = [
  { name: "Counter-Strike 2", genre: "FPS", image: "/Counter-Strike 2 (FPS).jpg", description: "30 мин | 1-5 игроков" },
  { name: "Dota 2", genre: "MOBA", image: "/Dota 2 (MOBA).jpg", description: "45 мин | 1-5 игроков" },
  { name: "League of Legends", genre: "MOBA", image: "/League of Legends (MOBA).jpg", description: "35 мин | 1-5 игроков" },
  { name: "Fortnite", genre: "Battle Royale", image: "/Fortnite (Battle Royale).jpg", description: "20 мин | 1-4 игроков" },
  { name: "Overwatch 2", genre: "FPS", image: "/Overwatch 2 (FPS).jpg", description: "25 мин | 1-6 игроков" },
  { name: "Cyberpunk 2077", genre: "RPG", image: "/Cyberpunk 2077 (RPG).jpg", description: "60+ мин | 1 игрок" },
  { name: "Elden Ring", genre: "RPG", image: "/Elden Ring (RPG).jpg", description: "90+ мин | 1-3 игроков" },
  { name: "Red Dead Redemption 2", genre: "Action", image: "/Red Dead Redemption 2 (Action.jpg", description: "120+ мин | 1 игрок" },
  { name: "Minecraft", genre: "Sandbox", image: "/Minecraft (Sandbox).jpg", description: "∞ мин | 1-8 игроков" },
  { name: "Valorant", genre: "FPS", image: "/Valorant.png", description: "40 мин | 1-5 игроков" },
  { name: "Apex Legends", genre: "Battle Royale", image: "/Apex Legends.png", description: "25 мин | 1-3 игроков" },
];

export function CyberGamesFlip() {
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
              В НАШЕМ КЛУБЕ
            </span>
          </div>
          <h2 className="font-black text-white uppercase" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            ПОПУЛЯРНЫЕ ИГРЫ
          </h2>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flip-card-container"
            >
              <div className="flip-card-content">
                {/* Front */}
                <div className="flip-card-front">
                  <div className="flip-card-img">
                    <div className="relative w-full h-full">
                      <Image
                        src={game.image}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        priority={index < 5}
                      />
                    </div>
                    <div className="flip-card-circles">
                      <div className="flip-circle"></div>
                      <div className="flip-circle" id="flip-right"></div>
                      <div className="flip-circle" id="flip-bottom"></div>
                    </div>
                  </div>
                  <div className="flip-card-front-content">
                    <small className="flip-badge">{game.genre}</small>
                    <div className="flip-description">
                      <div className="flip-title">
                        <p className="title">
                          <strong>{game.name}</strong>
                        </p>
                        <svg fillRule="nonzero" height="15px" width="15px" viewBox="0,0,256,256" xmlns="http://www.w3.org/2000/svg">
                          <g fill="#20c997" fillRule="nonzero"><g transform="scale(8,8)"><path d="M25,27l-9,-6.75l-9,6.75v-23h18z"></path></g></g>
                        </svg>
                      </div>
                      <p className="flip-card-footer">{game.description}</p>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back">
                  <div className="flip-back-content">
                    <svg stroke="#ffffff" width="50px" height="50px" viewBox="0 0 50 50" fill="#ffffff">
                      <path d="M20.84375 0.03125C20.191406 0.0703125 19.652344 0.425781 19.21875 1.53125C18.988281 2.117188 18.5 3.558594 18.03125 4.9375C17.792969 5.636719 17.570313 6.273438 17.40625 6.75C17.390625 6.796875 17.414063 6.855469 17.40625 6.90625L17.25 7.25C18.566406 7.65625 19.539063 8.058594 19.625 8.09375C22.597656 9.21875 28.351563 11.847656 33.28125 16.78125C38.5 22 41.183594 28.265625 42.09375 30.71875L42.75 32.84375C43.34375 32.664063 44.953125 32.09375 46.3125 31.625C47.109375 31.351563 47.808594 31.117188 48.15625 31C49.003906 30.714844 49.542969 30.292969 49.8125 29.6875C50.074219 29.109375 50.066406 28.429688 49.75 27.6875C49.605469 27.347656 49.441406 26.917969 49.25 26.4375C47.878906 23.007813 45.007813 15.882813 39.59375 10.46875C33.613281 4.484375 25.792969 1.210938 22.125 0.21875C21.648438 0.0898438 21.234375 0.0078125 20.84375 0.03125Z"></path>
                    </svg>
                    <strong>УСТАНОВЛЕНО</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .flip-card-container {
          overflow: visible;
          width: 100%;
          aspect-ratio: 3/4;
        }

        .flip-card-content {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 300ms;
          box-shadow: 0px 0px 10px 1px #000000ee;
          border-radius: 8px;
        }

        .flip-card-front,
        .flip-card-back {
          background-color: #151515;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 8px;
          overflow: hidden;
        }

        .flip-card-back {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotateY(180deg);
        }

        .flip-card-back::before {
          position: absolute;
          content: ' ';
          display: block;
          width: 160px;
          height: 160%;
          background: linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent);
          animation: rotation_481 5000ms infinite linear;
        }

        .flip-back-content {
          position: absolute;
          width: 99%;
          height: 99%;
          background-color: #151515;
          border-radius: 8px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .flip-card-container:hover .flip-card-content {
          transform: rotateY(180deg);
        }

        @keyframes rotation_481 {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        .flip-card-front-content {
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .flip-badge {
          background-color: #00000055;
          padding: 4px 12px;
          border-radius: 10px;
          backdrop-filter: blur(2px);
          width: fit-content;
          font-size: 10px;
          font-weight: bold;
        }

        .flip-description {
          box-shadow: 0px 0px 10px 5px #00000088;
          width: 100%;
          padding: 10px;
          background-color: #00000099;
          backdrop-filter: blur(5px);
          border-radius: 8px;
        }

        .flip-title {
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .flip-card-footer {
          color: #ffffff88;
          margin-top: 5px;
          font-size: 9px;
        }

        .flip-card-img {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .flip-card-circles {
          pointer-events: none;
        }

        .flip-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background-color: #ffbb66;
          position: absolute;
          filter: blur(15px);
          animation: floating 2600ms infinite linear;
        }

        #flip-bottom {
          background-color: #ff8866;
          left: 50px;
          top: 0px;
          width: 150px;
          height: 150px;
          animation-delay: -800ms;
        }

        #flip-right {
          background-color: #ff2233;
          right: 10px;
          top: 20px;
          width: 30px;
          height: 30px;
          animation-delay: -1800ms;
        }

        @keyframes floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
