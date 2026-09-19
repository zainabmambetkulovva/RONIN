"use client";

import { useState } from "react";
import Image from "next/image";
import { PlusIcon } from "@/components/ui/icons";

interface Game {
  id: string;
  name: string;
  genre: string;
  image: string;
  isActive: boolean;
}

const initialGames: Game[] = [
  { id: "1", name: "Counter-Strike 2", genre: "FPS", image: "/images (11).jpg", isActive: true },
  { id: "2", name: "Dota 2", genre: "MOBA", image: "/images (12).jpg", isActive: true },
  { id: "3", name: "Valorant", genre: "Tactical FPS", image: "/images (13).jpg", isActive: true },
  { id: "4", name: "League of Legends", genre: "MOBA", image: "/images (14).jpg", isActive: true },
  { id: "5", name: "GTA V", genre: "Action", image: "/Без названия (2).jpg", isActive: true },
  { id: "6", name: "Cyberpunk 2077", genre: "RPG", image: "/Без названия (3).jpg", isActive: true },
  { id: "7", name: "Apex Legends", genre: "Battle Royale", image: "/Без названия (4).jpg", isActive: true },
  { id: "8", name: "Call of Duty", genre: "FPS", image: "/Без названия (5).jpg", isActive: true },
  { id: "9", name: "Fortnite", genre: "Battle Royale", image: "/Без названия (6).jpg", isActive: false },
  { id: "10", name: "Minecraft", genre: "Sandbox", image: "/Без названия (7).jpg", isActive: true },
];

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games
    .filter((g) => {
      if (filter === "active") return g.isActive;
      if (filter === "inactive") return !g.isActive;
      return true;
    })
    .filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleToggleActive = (id: string) => {
    setGames(games.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g)));
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить эту игру из каталога?")) {
      setGames(games.filter((g) => g.id !== id));
    }
  };

  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      FPS: "#f97316",
      MOBA: "#ef4444",
      "Tactical FPS": "#f43f5e",
      Action: "#22c55e",
      RPG: "#fbbf24",
      "Battle Royale": "#fb923c",
      Sandbox: "#10b981",
    };
    return colors[genre] || "#60a5fa";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Игры</h1>
          <p className="text-gray-400">Управление каталогом игр</p>
        </div>
        <button
          onClick={() => alert("Функция добавления игры будет реализована")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
          }}
        >
          <PlusIcon className="w-5 h-5" />
          Добавить игру
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Всего игр</div>
          <div className="text-3xl font-black text-white">{games.length}</div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Активные</div>
          <div className="text-3xl font-black text-green-400">
            {games.filter((g) => g.isActive).length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Неактивные</div>
          <div className="text-3xl font-black text-red-400">
            {games.filter((g) => !g.isActive).length}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Поиск по названию или жанру..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Активные
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === "inactive"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Неактивные
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="rounded-xl overflow-hidden group hover:scale-[1.03] transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
              border: `1px solid ${game.isActive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              opacity: game.isActive ? 1 : 0.6,
            }}
          >
            {/* Image */}
            <div className="relative aspect-[2/3]">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    game.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-1.5"
                  style={{
                    background: `${getGenreColor(game.genre)}25`,
                    border: `1px solid ${getGenreColor(game.genre)}55`,
                    color: getGenreColor(game.genre),
                  }}
                >
                  {game.genre}
                </span>
                <h3 className="text-white font-black text-sm leading-tight">{game.name}</h3>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2">
              <button
                onClick={() => handleToggleActive(game.id)}
                className={`w-full px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  game.isActive
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {game.isActive ? "Скрыть" : "Показать"}
              </button>
              <button
                onClick={() => handleDelete(game.id)}
                className="w-full px-3 py-1.5 rounded text-xs font-bold transition-all bg-red-600 hover:bg-red-700 text-white"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p className="text-gray-400">
            {searchQuery
              ? `Игры не найдены по запросу "${searchQuery}"`
              : "Нет игр с выбранным фильтром"}
          </p>
        </div>
      )}
    </div>
  );
}
