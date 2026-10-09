"use client";

import { Mail, Phone, Trash2, Edit, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

interface Manager {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  createdAt: Date;
}

interface ManagersTableProps {
  managers: Manager[];
}

export function ManagersTable({ managers }: ManagersTableProps) {
  const [selectedManager, setSelectedManager] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить менеджера "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/managers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-400">
        <div className="col-span-3">Менеджер</div>
        <div className="col-span-3">Контакты</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-3">Дата регистрации</div>
        <div className="col-span-1 text-right">Действия</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-800">
        {managers && managers.length > 0 ? (
          managers.map((manager) => (
            <div
              key={manager.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-900/50 transition-colors"
            >
              {/* Name */}
              <div className="col-span-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  }}
                >
                  {manager.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{manager.name}</div>
                  <div className="text-xs text-gray-500">Менеджер</div>
                </div>
              </div>

              {/* Contacts */}
              <div className="col-span-3 flex flex-col gap-1 justify-center">
                {manager.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span>{manager.email}</span>
                  </div>
                )}
                {manager.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span>{manager.phone}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background: manager.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    border: manager.status === 'active' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                    color: manager.status === 'active' ? '#10b981' : '#ef4444',
                  }}
                >
                  {manager.status === 'active' ? 'Активен' : 'Неактивен'}
                </span>
              </div>

              {/* Created At */}
              <div className="col-span-3 flex items-center text-sm text-gray-400">
                {format(new Date(manager.createdAt), "dd MMM yyyy, HH:mm", { locale: ru })}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDelete(manager.id, manager.name)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-500 mb-2">Нет менеджеров</div>
            <p className="text-xs text-gray-600">Добавьте первого менеджера</p>
          </div>
        )}
      </div>
    </div>
  );
}
