"use client";

import { User, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface RecentUser {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdAt: Date;
}

interface RecentUsersProps {
  users: RecentUser[];
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">
            Recent Registrations
          </h3>
          <p className="text-xs text-gray-500">Последние регистрации</p>
        </div>
        <a 
          href="/admin/users"
          className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors hover:scale-105"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#60a5fa",
          }}
        >
          Все →
        </a>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 mb-3 pb-2 border-b border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-500">
        <div className="col-span-4">Пользователь</div>
        <div className="col-span-4">Контакт</div>
        <div className="col-span-4">Дата</div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg transition-all hover:scale-[1.01] cursor-pointer"
              style={{
                background: "rgba(15,15,30,0.5)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              {/* Name */}
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {user.name}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-4 min-w-0">
                {user.email ? (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                ) : user.phone ? (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">Нет данных</span>
                )}
              </div>

              {/* Date */}
              <div className="col-span-4 flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{format(new Date(user.createdAt), "dd MMM, HH:mm", { locale: ru })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет недавних регистраций</p>
          </div>
        )}
      </div>
    </div>
  );
}
