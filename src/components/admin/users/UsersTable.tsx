"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  bookingsCount: number;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", label: "Admin" },
      manager: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", label: "Manager" },
      client: { bg: "rgba(107,114,128,0.15)", text: "#9ca3af", label: "Client" },
    };
    return styles[role as keyof typeof styles] || styles.client;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: "rgba(16,185,129,0.15)", text: "#10b981", label: "Активен" },
      blocked: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", label: "Заблокирован" },
      deleted: { bg: "rgba(107,114,128,0.15)", text: "#6b7280", label: "Удалён" },
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Вы уверены что хотите удалить пользователя "${userName}"?`)) {
      return;
    }

    setIsDeleting(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка удаления");
      }

      alert("Пользователь удалён! Обновите страницу.");
      window.location.reload();
    } catch (error) {
      alert("Ошибка при удалении пользователя");
      setIsDeleting(null);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(7,7,26,0.9), rgba(13,13,36,0.9))",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {/* Filters */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(59,130,246,0.1)" }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по имени, email или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
              onFocus={(e) => (e.target.style.outline = "2px solid rgba(59,130,246,0.5)")}
              onBlur={(e) => (e.target.style.outline = "none")}
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm text-white outline-none"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <option value="all">Все роли</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm text-white outline-none"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
            <option value="deleted">Удалённые</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(59,130,246,0.05)" }}>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Регистрация
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Брони
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.status);

              return (
                <tr
                  key={user.id}
                  className="border-t hover:bg-white/5 transition-colors"
                  style={{ borderColor: "rgba(59,130,246,0.08)" }}
                >
                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${roleBadge.text}88, ${roleBadge.text}44)`,
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contacts */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.phone}</p>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-xs font-bold"
                      style={{ background: roleBadge.bg, color: roleBadge.text }}
                    >
                      {roleBadge.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-xs font-bold"
                      style={{ background: statusBadge.bg, color: statusBadge.text }}
                    >
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Created at */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">{user.createdAt}</p>
                  </td>

                  {/* Bookings count */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-blue-400">{user.bookingsCount}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 rounded-lg transition-all hover:bg-blue-500/10"
                        title="Редактировать"
                        style={{ border: "1px solid rgba(59,130,246,0.2)" }}
                        onClick={() => alert("Функционал редактирования будет добавлен далее")}
                      >
                        <svg className="w-4 h-4" style={{ color: "#60a5fa" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        className="p-2 rounded-lg transition-all hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Удалить"
                        style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={isDeleting === user.id}
                      >
                        {isDeleting === user.id ? (
                          <svg className="w-4 h-4 animate-spin" style={{ color: "#ef4444" }} fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" style={{ color: "#ef4444" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400">Пользователи не найдены</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(59,130,246,0.1)" }}>
        <p className="text-sm text-gray-400">
          Показано {filteredUsers.length} из {users.length} пользователей
        </p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 transition-all hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(59,130,246,0.2)" }}
          >
            Назад
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              color: "white",
            }}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}
