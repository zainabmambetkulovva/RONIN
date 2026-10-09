"use client";

import { Plus, Users, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { AddManagerModal } from "./AddManagerModal";

interface ManagersHeaderProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export function ManagersHeader({ stats }: ManagersHeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
              Менеджеры
            </h1>
            <p className="text-gray-400 text-sm">Управление менеджерами клуба</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              color: "#fff",
            }}
          >
            <Plus className="w-4 h-4" />
            Добавить менеджера
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(139,92,246,0.2)",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <Users className="w-6 h-6" style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stats.total}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Всего менеджеров</div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(16,185,129,0.2)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              <UserCheck className="w-6 h-6" style={{ color: "#10b981" }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stats.active}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Активных</div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <UserX className="w-6 h-6" style={{ color: "#ef4444" }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stats.inactive}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Неактивных</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Manager Modal */}
      {showModal && <AddManagerModal onClose={() => setShowModal(false)} />}
    </>
  );
}
