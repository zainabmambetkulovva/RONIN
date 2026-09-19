"use client";

import { useState } from "react";
import { AddUserModal } from "./AddUserModal";

interface UsersHeaderProps {
  stats: {
    total: number;
    active: number;
    blocked: number;
    managers: number;
  };
}

export function UsersHeader({ stats }: UsersHeaderProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSuccess = () => {
    // TODO: Refresh users list
    alert("Пользователь успешно создан! Обновите страницу.");
  };

  return (
    <div>
      {/* Title and action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Пользователи</h1>
          <p className="text-gray-400">Управление пользователями системы</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 0 20px rgba(59,130,246,0.4)",
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить пользователя
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <p className="text-sm text-gray-400 mb-1">Всего пользователей</p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <p className="text-sm text-gray-400 mb-1">Активные</p>
          <p className="text-2xl font-black" style={{ color: "#10b981" }}>
            {stats.active}
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <p className="text-sm text-gray-400 mb-1">Заблокированы</p>
          <p className="text-2xl font-black" style={{ color: "#ef4444" }}>
            {stats.blocked}
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <p className="text-sm text-gray-400 mb-1">Менеджеры</p>
          <p className="text-2xl font-black" style={{ color: "#f59e0b" }}>
            {stats.managers}
          </p>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
