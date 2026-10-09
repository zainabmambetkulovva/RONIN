"use client";

import { Trash2, ToggleLeft, ToggleRight, Mail, Phone, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ManagerCardProps {
  manager: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    avatar: string | null;
    createdAt: string;
  };
  onDelete: (managerId: string) => void;
  onToggleStatus: (managerId: string, currentStatus: string) => void;
}

export function ManagerCard({ manager, onDelete, onToggleStatus }: ManagerCardProps) {
  const isActive = manager.status === "active";
  const statusColor = isActive ? "#10b981" : "#6b7280";

  const getAvatarGradient = () => {
    const num = manager.id.charCodeAt(0);
    return "linear-gradient(135deg, #8b5cf6, #6366f1)";
  };

  return (
    <div
      className="rounded-2xl p-6 transition-all hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: `1px solid ${isActive ? "rgba(139,92,246,0.5)" : "rgba(107,114,128,0.3)"}`,
      }}
    >
      {/* Avatar and Name */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0 relative"
          style={{
            background: getAvatarGradient(),
            color: "#fff",
          }}
        >
          {manager.name.charAt(0).toUpperCase()}
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: statusColor,
              border: "2px solid #0f0f1e",
            }}
          >
            <Shield className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg mb-1 truncate">{manager.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{
                background: `${statusColor}22`,
                color: statusColor,
                border: `1px solid ${statusColor}44`,
              }}
            >
              {isActive ? "Работает" : "Неактивен"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {manager.email && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{manager.email}</span>
          </div>
        )}
        {manager.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{manager.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            Создан {format(new Date(manager.createdAt), "dd MMM yyyy", { locale: ru })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggleStatus(manager.id, manager.status)}
          className="flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2"
          style={{
            background: isActive
              ? "rgba(107,114,128,0.2)"
              : "rgba(16,185,129,0.2)",
            border: isActive
              ? "1px solid rgba(107,114,128,0.3)"
              : "1px solid rgba(16,185,129,0.3)",
            color: isActive ? "#6b7280" : "#10b981",
          }}
        >
          {isActive ? (
            <>
              <ToggleLeft className="w-4 h-4" />
              Деактивировать
            </>
          ) : (
            <>
              <ToggleRight className="w-4 h-4" />
              Активировать
            </>
          )}
        </button>
        <button
          onClick={() => onDelete(manager.id)}
          className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
          style={{
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
