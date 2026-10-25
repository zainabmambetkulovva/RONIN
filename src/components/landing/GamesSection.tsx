"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Marquee } from "@/components/ui/Marquee";
import { Section, SectionHeading } from "./primitives";

/**
 * Игры для карусели. Изображения — только качественные файлы из /public;
 * для игр без нормальной обложки показывается типографская карточка (без случайных картинок).
 */
const GAMES: Array<{ name: string; genre: string; image?: string; gradient: string }> = [
  { name: "Counter-Strike 2", genre: "FPS", image: "/Counter-Strike 2 (FPS).jpg", gradient: "from-orange-500/40 to-rn-violet/40" },
  { name: "Valorant", genre: "FPS", image: "/Valorant.png", gradient: "from-rn-pink/40 to-rn-electric/30" },
  { name: "Dota 2", genre: "MOBA", gradient: "from-red-600/50 via-rn-magenta/30 to-rn-void" },
  // Файл называется «Apex Legends.png», но на изображении — обложка League of Legends
  { name: "League of Legends", genre: "MOBA", image: "/Apex Legends.png", gradient: "from-amber-400/40 via-rn-electric/30 to-rn-void" },
  { name: "Apex Legends", genre: "Battle Royale", gradient: "from-red-500/50 via-rn-magenta/25 to-rn-void" },
  { name: "Fortnite", genre: "Battle Royale", gradient: "from-rn-cyan/40 via-rn-violet/30 to-rn-void" },
  { name: "Overwatch 2", genre: "FPS", gradient: "from-orange-400/40 via-rn-electric/30 to-rn-void" },
  { name: "Cyberpunk 2077", genre: "RPG", gradient: "from-yellow-300/40 via-rn-pink/30 to-rn-void" },
];

export function GamesSection() {
  const { t } = useLanguage();

  return (
    <Section id="games" className="overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-rn-magenta/15 blur-[120px]" aria-hidden />
      <SectionHeading eyebrow={t("games.eyebrow")} title={t("games.title")} subtitle={t("games.subtitle")} />

      <Marquee ariaLabel={t("games.title")} itemClassName="w-[200px] sm:w-[240px]" speed={45}>
        {GAMES.map((game) => (
          <article
            key={game.name}
            className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-rn-line bg-rn-surface transition-all duration-500 hover:border-rn-magenta/60 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]"
          >
            {game.image ? (
              <Image
                src={game.image}
                alt={game.name}
                fill
                sizes="250px"
                draggable={false}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} aria-hidden>
                <div className="rn-grid-bg absolute inset-0 opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-rn-void via-rn-void/30 to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="mb-2 inline-block rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-rn-cyan backdrop-blur">
                {game.genre}
              </span>
              <h3 className="font-display text-lg font-bold uppercase leading-tight text-white">{game.name}</h3>
            </div>
          </article>
        ))}
      </Marquee>
    </Section>
  );
}
