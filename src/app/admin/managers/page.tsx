"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "blocked";
  createdAt: string;
  lastActive: string;
}

const initialManagers: Manager[] = [
  {
    id: "1",
    name: "Алексей Менеджеров",
    email: "manager1@ronin.kg",
    phone: "+996 555 123 456",
    status: "active",
    createdAt: "2024-01-10",
    lastActive: "2 часа назад",
  },
  {
    id: "2",
    name: "Мария Администратор",
    email: "manager2@ronin.kg",
    phone: "+996 555 789 012",
    status: "active",
    createdAt: "2024-01-12",
    lastActive: "15 минут назад",
  },
  {
    id: "3",
    name: "Иван Помощник",
    email: "manager3@ronin.kg",
    phone: "+996 555 345 678",
    status: "blocked",
    createdAt: "2024-01-05",
    lastActive: "3 дня назад",
  },
];

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(initialManagers);
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all");

  const filteredManagers =
    filter === "all"
      ? managers
      : managers.filter((m) => m.status === filter);

  const handleToggleStatus = (id: string) => {
    setManagers(
      managers.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "active" ? "blocked" : "active",
            }
          : m
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить этого менеджера? Это действие нельзя отменить.")) {
      setManagers(managers.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Менеджеры</h1>
          <p className="text-gray-400">Управление менеджерами клуба</p>
        </div>
        <button
          onClick={() => alert("Функция добавления менеджера будет реализована")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
          }}
        >
          <PlusIcon className="w-5 h-5" />
          Добавить менеджера
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
          <div className="text-gray-400 text-sm mb-1">Всего менеджеров</div>
          <div className="text-3xl font-black text-white">{managers.length}</div>
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
            {managers.filter((m) => m.status === "active").length}
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <div className="text-gray-400 text-sm mb-1">Заблокированные</div>
          <div className="text-3xl font-black text-red-400">
            {managers.filter((m) => m.status === "blocked").length}
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
          onClick={() => setFilter("blocked")}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            filter === "blocked"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Заблокированные
        </button>
      </div>

      {/* Managers Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Последняя активность
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map((manager) => (
                <tr
                  key={manager.id}
                  className="hover:bg-white/5 transition-colors"
                  style={{ borderBottom: "1px solid rgba(59,130,246,0.05)" }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        }}
                      >
                        {manager.name.charAt(0)}
                      </div>
                      <span className="text-white font-bold">{manager.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{manager.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{manager.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{manager.lastActive}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{manager.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        manager.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {manager.status === "active" ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(manager.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          manager.status === "active"
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                      >
                        {manager.status === "active" ? "Заблокировать" : "Активировать"}
                      </button>
                      <button
                        onClick={() => handleDelete(manager.id)}
                        className="px-3 py-1 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredManagers.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <p className="text-gray-400">Нет менеджеров с выбранным фильтром</p>
        </div>
      )}
    </div>
  );
}
