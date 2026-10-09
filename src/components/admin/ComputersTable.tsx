"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Computer {
  id: string;
  number: number;
  name: string;
  status: string;
  specs: any;
  bookings: Array<{
    id: string;
    startAt: Date;
    endAt: Date;
    status: string;
  }>;
}

interface Props {
  computers: Computer[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: "Доступен", color: "#22c55e" },
  occupied: { label: "Занят", color: "#ef4444" },
  maintenance: { label: "Ремонт", color: "#fb923c" },
};

export function ComputersTable({ computers }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [hoveredComputer, setHoveredComputer] = useState<string | null>(null);

  // Фильтрация
  const filtered = computers.filter((c) => {
    const isOccupied = c.bookings.length > 0;
    const actualStatus = isOccupied ? "occupied" : c.status;
    
    const matchesFilter =
      filter === "all" ||
      (filter === "available" && !isOccupied && c.status === "available") ||
      (filter === "occupied" && isOccupied) ||
      (filter === "maintenance" && c.status === "maintenance");

    const matchesSearch =
      search === "" ||
      c.number.toString().includes(search) ||
      c.name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
        border: "1px solid rgba(59,130,246,0.2)",
      }}
    >
      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по номеру или названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: "rgba(15,15,30,0.6)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <option value="all">Все статусы</option>
          <option value="available">Доступно</option>
          <option value="occupied">Занято</option>
          <option value="maintenance">На ремонте</option>
        </select>
      </div>

      {/* Сетка компьютеров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Компьютеры не найдены
          </div>
        ) : (
          filtered.map((computer) => {
            const isOccupied = computer.bookings.length > 0;
            const actualStatus = isOccupied ? "occupied" : computer.status;
            const currentBooking = computer.bookings[0];

            return (
              <div
                key={computer.id}
                className="relative"
                onMouseEnter={() => setHoveredComputer(computer.id)}
                onMouseLeave={() => setHoveredComputer(null)}
              >
                <div
                  className="p-4 rounded-lg transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: "rgba(15,15,30,0.6)",
                    border: `2px solid ${statusLabels[actualStatus]?.color}40`,
                  }}
                >
                  {/* Номер и статус */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-black text-white">
                      #{computer.number}
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        background: `${statusLabels[actualStatus]?.color}20`,
                        color: statusLabels[actualStatus]?.color,
                      }}
                    >
                      {statusLabels[actualStatus]?.label}
                    </span>
                  </div>

                  {/* Название */}
                  <div className="text-sm font-bold text-white mb-2">
                    {computer.name}
                  </div>

                  {/* Характеристики */}
                  {computer.specs && (
                    <div className="space-y-1">
                      {computer.specs.cpu && (
                        <div className="text-xs text-gray-400">
                          <span className="text-blue-400">CPU:</span> {computer.specs.cpu}
                        </div>
                      )}
                      {computer.specs.gpu && (
                        <div className="text-xs text-gray-400">
                          <span className="text-purple-400">GPU:</span> {computer.specs.gpu}
                        </div>
                      )}
                      {computer.specs.ram && (
                        <div className="text-xs text-gray-400">
                          <span className="text-pink-400">RAM:</span> {computer.specs.ram}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Всплывающая карточка */}
                {hoveredComputer === computer.id && (
                  <div
                    className="absolute z-50 p-4 rounded-lg shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #0d0b2a 0%, #1a0a3e 100%)",
                      border: `2px solid ${statusLabels[actualStatus]?.color}`,
                      boxShadow: `0 10px 40px ${statusLabels[actualStatus]?.color}60`,
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: "8px",
                      minWidth: "250px",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-black text-white mb-2">
                        Компьютер #{computer.number}
                      </div>

                      {computer.status === "maintenance" ? (
                        <div className="text-orange-400 font-bold">
                          ⚠️ Не работает
                        </div>
                      ) : isOccupied && currentBooking ? (
                        <>
                          <div className="text-red-400 font-bold mb-2">
                            🔴 Занят
                          </div>
                          <div className="text-sm text-gray-300">
                            <div>
                              с {format(new Date(currentBooking.startAt), "HH:mm", { locale: ru })}
                            </div>
                            <div>
                              до {format(new Date(currentBooking.endAt), "HH:mm", { locale: ru })}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {format(new Date(currentBooking.startAt), "dd MMMM", { locale: ru })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-green-400 font-bold">
                          ✅ Свободен
                        </div>
                      )}
                    </div>

                    {/* Треугольник указатель */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderBottom: `10px solid ${statusLabels[actualStatus]?.color}`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Итого */}
      <div className="mt-6 text-sm text-gray-500">
        Показано {filtered.length} из {computers.length}
      </div>
    </div>
  );
}
