"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

interface Computer {
  id: string;
  number: number;
  category: string;
  status: "available" | "maintenance";
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    monitor: string;
  };
}

// Тестовые данные
const initialComputers: Computer[] = [
  {
    id: "1",
    number: 1,
    category: "VIP",
    status: "available",
    specs: {
      cpu: "Intel Core i9-13900K",
      gpu: "RTX 4090 24GB",
      ram: "64GB DDR5",
      monitor: "ASUS ROG 27\" 240Hz",
    },
  },
  {
    id: "2",
    number: 2,
    category: "VIP",
    status: "available",
    specs: {
      cpu: "Intel Core i9-13900K",
      gpu: "RTX 4090 24GB",
      ram: "64GB DDR5",
      monitor: "ASUS ROG 27\" 240Hz",
    },
  },
  {
    id: "3",
    number: 3,
    category: "Premium",
    status: "available",
    specs: {
      cpu: "Intel Core i7-13700K",
      gpu: "RTX 4070 Ti 12GB",
      ram: "32GB DDR5",
      monitor: "Dell 27\" 165Hz",
    },
  },
  {
    id: "4",
    number: 4,
    category: "Premium",
    status: "maintenance",
    specs: {
      cpu: "Intel Core i7-13700K",
      gpu: "RTX 4070 Ti 12GB",
      ram: "32GB DDR5",
      monitor: "Dell 27\" 165Hz",
    },
  },
  {
    id: "5",
    number: 5,
    category: "Standard",
    status: "available",
    specs: {
      cpu: "Intel Core i5-13600K",
      gpu: "RTX 4060 Ti 8GB",
      ram: "16GB DDR4",
      monitor: "AOC 24\" 144Hz",
    },
  },
];

export default function ComputersPage() {
  const [computers, setComputers] = useState<Computer[]>(initialComputers);
  const [filter, setFilter] = useState<"all" | "available" | "maintenance">("all");

  const filteredComputers =
    filter === "all"
      ? computers
      : computers.filter((c) => c.status === filter);

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот компьютер?")) {
      setComputers(computers.filter((c) => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setComputers(
      computers.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "available" ? "maintenance" : "available",
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Компьютеры</h1>
          <p className="text-gray-400">Управление компьютерами клуба</p>
        </div>
        <button
          onClick={() => alert("Функция добавления будет реализована")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
          }}
        >
          <PlusIcon className="w-5 h-5" />
          Добавить компьютер
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
          <div className="text-gray-400 text-sm mb-1">Всего компьютеров</div>
          <div className="text-3xl font-black text-white">{computers.length}</div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Доступно</div>
          <div className="text-3xl font-black text-green-400">
            {computers.filter((c) => c.status === "available").length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(251,146,60,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">На обслуживании</div>
          <div className="text-3xl font-black text-orange-400">
            {computers.filter((c) => c.status === "maintenance").length}
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
          onClick={() => setFilter("available")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "available"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Доступные
        </button>
        <button
          onClick={() => setFilter("maintenance")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "maintenance"
              ? "bg-orange-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          На обслуживании
        </button>
      </div>

      {/* Computers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComputers.map((computer) => (
          <div
            key={computer.id}
            className="rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
              border: `1px solid ${
                computer.status === "available"
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(251,146,60,0.2)"
              }`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-black text-white mb-1">
                  ПК #{computer.number}
                </div>
                <div
                  className="inline-block px-2 py-1 rounded text-xs font-bold uppercase"
                  style={{
                    background:
                      computer.category === "VIP"
                        ? "rgba(251,146,60,0.2)"
                        : computer.category === "Premium"
                        ? "rgba(139,92,246,0.2)"
                        : "rgba(59,130,246,0.2)",
                    color:
                      computer.category === "VIP"
                        ? "#fb923c"
                        : computer.category === "Premium"
                        ? "#a78bfa"
                        : "#60a5fa",
                  }}
                >
                  {computer.category}
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  computer.status === "available" ? "bg-green-500" : "bg-orange-500"
                }`}
              />
            </div>

            {/* Specs */}
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">CPU:</span>{" "}
                <span className="text-gray-300">{computer.specs.cpu}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">GPU:</span>{" "}
                <span className="text-gray-300">{computer.specs.gpu}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">RAM:</span>{" "}
                <span className="text-gray-300">{computer.specs.ram}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Монитор:</span>{" "}
                <span className="text-gray-300">{computer.specs.monitor}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  computer.status === "available"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {computer.status === "available" ? "Доступен" : "На обслуживании"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleStatus(computer.id)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white"
              >
                {computer.status === "available"
                  ? "На обслуживание"
                  : "Вернуть в строй"}
              </button>
              <button
                onClick={() => handleDelete(computer.id)}
                className="px-3 py-2 rounded-lg text-sm font-bold transition-all bg-red-600 hover:bg-red-700 text-white"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredComputers.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p className="text-gray-400">Нет компьютеров с выбранным фильтром</p>
        </div>
      )}
    </div>
  );
}
