"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Marquee } from "@/components/ui/Marquee";
import type { GameDTO } from "@/types/api";
import { Section, SectionHeading } from "./primitives";

/** Пока список с сервера не пришёл — стандартные игры (те же, что отдаёт сервер без настроек). */
const FALLBACK: GameDTO[] = [
  { id: "cs2", name: "Counter-Strike 2", genre: "FPS", imageUrl: "/Counter-Strike 2 (FPS).jpg" },
  { id: "valorant", name: "Valorant", genre: "FPS", imageUrl: "/Valorant.png" },
  { id: "lol", name: "League of Legends", genre: "MOBA", imageUrl: "/Apex Legends.png" },
];

/** Цвета карточки без обложки — стабильно по названию игры. */
const PLACEHOLDER_GRADIENTS = [
  "from-rn-violet/60 via-rn-magenta/30 to-rn-void",
  "from-rn-electric/55 via-rn-cyan/25 to-rn-void",
  "from-rn-magenta/55 via-rn-pink/25 to-rn-void",
  "from-orange-500/50 via-rn-magenta/25 to-rn-void",
  "from-emerald-500/45 via-rn-cyan/20 to-rn-void",
];
function gradientFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PLACEHOLDER_GRADIENTS[h % PLACEHOLDER_GRADIENTS.length];
}

export function GamesSection() {
  const { t } = useLanguage();
  const [games, setGames] = useState<GameDTO[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/games")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.games?.length && setGames(data.games))
      .catch(() => undefined);
  }, []);

  return (
    <Section id="games" className="overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-rn-magenta/15 blur-[120px]" aria-hidden />
      <SectionHeading eyebrow={t("games.eyebrow")} title={t("games.title")} subtitle={t("games.subtitle")} />

      <Marquee ariaLabel={t("games.title")} itemClassName="w-[240px] sm:w-[300px]" speed={45}>
        {games.map((game) => (
          <article
            key={game.id}
            className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-rn-line bg-rn-surface shadow-[0_10px_30px_-15px_rgba(217,70,239,0)] transition-all duration-700 ease-out hover:border-rn-magenta/60 hover:shadow-[0_10px_30px_-10px_rgba(217,70,239,0.45)]"
          >
            {game.imageUrl ? (
              <Image
                src={game.imageUrl}
                alt={game.name}
                fill
                sizes="300px"
                draggable={false}
                // Лента двигает карточки через transform — «ленивая» загрузка не видит их и оставляет пустыми
                loading="eager"
                unoptimized={game.imageUrl.startsWith("/api/")}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              // Обложки нет — оформленная карточка с названием (обложку можно загрузить в «Настройки → Игры»)
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFor(game.name)}`} aria-hidden>
                <div className="rn-grid-bg absolute inset-0 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center pb-16">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-[0_0_40px_rgba(168,85,247,0.35)] backdrop-blur transition-transform duration-700 group-hover:scale-110">
                    <Gamepad2 className="h-10 w-10 text-white" />
                  </span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-rn-void via-rn-void/30 to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              {game.genre && (
                <span className="mb-2 inline-block rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-rn-cyan backdrop-blur">
                  {game.genre}
                </span>
              )}
              <h3 className="font-display text-lg font-bold uppercase leading-tight text-white">{game.name}</h3>
            </div>
          </article>
        ))}
      </Marquee>
    </Section>
  );
}
