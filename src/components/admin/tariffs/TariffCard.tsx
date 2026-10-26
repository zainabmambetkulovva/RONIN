"use client";

import { Edit2, Trash2, ToggleLeft, ToggleRight, Wallet, Clock, Tag } from "lucide-react";

interface TariffCardProps {
  tariff: {
    id: string;
    name: string;
    durationMinutes: number;
    price: string;
    type: string;
    isActive: boolean;
    category: { name: string } | null;
  };
  onEdit: (tariff: any) => void;
  onToggle: (tariffId: string, currentActive: boolean) => void;
  onDelete: (tariffId: string) => void;
}

export function TariffCard({ tariff, onEdit, onToggle, onDelete }: TariffCardProps) {
  const typeLabels: Record<string, string> = {
    hourly: "Почасовой",
    package: "Пакетный",
    night: "Ночной",
    morning: "Утренний",
  };

  const typeColors: Record<string, string> = {
    hourly: "#3b82f6",
    package: "#8b5cf6",
    night: "#6366f1",
    morning: "#f59e0b",
  };

  const statusColor = tariff.isActive ? "#10b981" : "#6b7280";
  const typeColor = typeColors[tariff.type] || "#6b7280";

  return (
    <div
      className="rounded-2xl p-6 transition-all hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: `1px solid ${tariff.isActive ? "rgba(16,185,129,0.5)" : "rgba(107,114,128,0.3)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">{tariff.name}</h3>
          {tariff.category && (
            <p className="text-gray-400 text-sm">{tariff.category.name}</p>
          )}
        </div>
        <div
          className="px-3 py-1 rounded-lg text-xs font-bold uppercase"
          style={{
            background: `${statusColor}22`,
            color: statusColor,
            border: `1px solid ${statusColor}44`,
          }}
        >
          {tariff.isActive ? "Активен" : "Неактивен"}
        </div>
      </div>

      {/* Price and Duration */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4" style={{ color: "#10b981" }} />
            <span className="text-xs text-gray-400 uppercase">Цена</span>
          </div>
          <div className="text-xl font-black" style={{ color: "#10b981" }}>
            {tariff.price} сом
          </div>
        </div>
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" style={{ color: "#3b82f6" }} />
            <span className="text-xs text-gray-400 uppercase">Время</span>
          </div>
          <div className="text-xl font-black" style={{ color: "#3b82f6" }}>
            {tariff.durationMinutes} мин
          </div>
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-4 h-4" style={{ color: typeColor }} />
        <span
          className="px-2 py-1 rounded text-xs font-bold"
          style={{
            background: `${typeColor}22`,
            color: typeColor,
            border: `1px solid ${typeColor}44`,
          }}
        >
          {typeLabels[tariff.type]}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(tariff)}
          className="flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2"
          style={{
            background: "rgba(59,130,246,0.2)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#3b82f6",
          }}
        >
          <Edit2 className="w-4 h-4" />
          Изменить
        </button>
        <button
          onClick={() => onToggle(tariff.id, tariff.isActive)}
          className="px-4 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
          style={{
            background: tariff.isActive
              ? "rgba(107,114,128,0.2)"
              : "rgba(16,185,129,0.2)",
            border: tariff.isActive
              ? "1px solid rgba(107,114,128,0.3)"
              : "1px solid rgba(16,185,129,0.3)",
            color: tariff.isActive ? "#6b7280" : "#10b981",
          }}
        >
          {tariff.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onDelete(tariff.id)}
          className="px-4 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
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
