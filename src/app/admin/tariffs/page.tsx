"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

interface Tariff {
  id: string;
  name: string;
  category: string;
  type: string;
  duration: number;
  price: number;
  isActive: boolean;
}

const initialTariffs: Tariff[] = [
  {
    id: "1",
    name: "VIP - 1 час",
    category: "VIP",
    type: "hourly",
    duration: 60,
    price: 400,
    isActive: true,
  },
  {
    id: "2",
    name: "VIP - 2 часа",
    category: "VIP",
    type: "package",
    duration: 120,
    price: 750,
    isActive: true,
  },
  {
    id: "3",
    name: "Premium - 1 час",
    category: "Premium",
    type: "hourly",
    duration: 60,
    price: 300,
    isActive: true,
  },
  {
    id: "4",
    name: "Standard - 1 час",
    category: "Standard",
    type: "hourly",
    duration: 60,
    price: 150,
    isActive: true,
  },
  {
    id: "5",
    name: "Ночной VIP",
    category: "VIP",
    type: "night",
    duration: 480,
    price: 2000,
    isActive: true,
  },
  {
    id: "6",
    name: "Утренний Premium",
    category: "Premium",
    type: "morning",
    duration: 240,
    price: 800,
    isActive: false,
  },
];

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>(initialTariffs);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredTariffs =
    filter === "all"
      ? tariffs
      : tariffs.filter((t) => (filter === "active" ? t.isActive : !t.isActive));

  const handleToggleActive = (id: string) => {
    setTariffs(
      tariffs.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить этот тариф?")) {
      setTariffs(tariffs.filter((t) => t.id !== id));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "VIP":
        return { bg: "rgba(251,146,60,0.2)", text: "#fb923c" };
      case "Premium":
        return { bg: "rgba(139,92,246,0.2)", text: "#a78bfa" };
      case "Standard":
        return { bg: "rgba(59,130,246,0.2)", text: "#60a5fa" };
      default:
        return { bg: "rgba(156,163,175,0.2)", text: "#9ca3af" };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hourly":
        return "Почасовой";
      case "package":
        return "Пакет";
      case "night":
        return "Ночной";
      case "morning":
        return "Утренний";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Тарифы</h1>
          <p className="text-gray-400">Управление ценами и тарифными планами</p>
        </div>
        <button
          onClick={() => alert("Функция добавления тарифа будет реализована")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
          }}
        >
          <PlusIcon className="w-5 h-5" />
          Добавить тариф
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
          <div className="text-gray-400 text-sm mb-1">Всего тарифов</div>
          <div className="text-3xl font-black text-white">{tariffs.length}</div>
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
            {tariffs.filter((t) => t.isActive).length}
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
            {tariffs.filter((t) => !t.isActive).length}
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Tariffs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTariffs.map((tariff) => {
          const categoryStyle = getCategoryColor(tariff.category);
          return (
            <div
              key={tariff.id}
              className="rounded-xl p-6 hover:scale-[1.02] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
                border: `1px solid ${tariff.isActive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                opacity: tariff.isActive ? 1 : 0.7,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{tariff.name}</h3>
                  <div className="flex gap-2">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-bold uppercase"
                      style={{
                        background: categoryStyle.bg,
                        color: categoryStyle.text,
                      }}
                    >
                      {tariff.category}
                    </span>
                    <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-gray-800 text-gray-400">
                      {getTypeLabel(tariff.type)}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    tariff.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Длительность</div>
                  <div className="text-white font-bold">
                    {tariff.duration >= 60
                      ? `${Math.floor(tariff.duration / 60)} ч ${tariff.duration % 60 > 0 ? tariff.duration % 60 + " мин" : ""}`
                      : `${tariff.duration} мин`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Цена</div>
                  <div className="text-3xl font-black text-transparent bg-clip-text" style={{
                    backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                  }}>
                    {tariff.price} ₸
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    tariff.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {tariff.isActive ? "Активен" : "Неактивен"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(tariff.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    tariff.isActive
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {tariff.isActive ? "Деактивировать" : "Активировать"}
                </button>
                <button
                  onClick={() => handleDelete(tariff.id)}
                  className="px-3 py-2 rounded-lg text-sm font-bold transition-all bg-red-600 hover:bg-red-700 text-white"
                >
                  Удалить
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTariffs.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p className="text-gray-400">Нет тарифов с выбранным фильтром</p>
        </div>
      )}
    </div>
  );
}
