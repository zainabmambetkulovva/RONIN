"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { CreateManagerModal } from "@/components/admin/managers/CreateManagerModal";
import { ManagerCard } from "@/components/admin/managers/ManagerCard";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { RollingLoader } from "@/components/ui/RollingLoader";

interface Manager {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  avatar: string | null;
  createdAt: string;
}

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [managers, searchQuery, statusFilter]);

  const fetchManagers = async () => {
    try {
      const res = await fetch("/api/admin/users?role=manager");
      const data = await res.json();
      setManagers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterManagers = () => {
    let filtered = [...managers];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query) ||
          m.phone?.includes(query)
      );
    }

    setFilteredManagers(filtered);
  };

  const handleDeleteManager = async (managerId: string) => {
    if (!confirm("Удалить менеджера? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${managerId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setManagers(managers.filter((m) => m.id !== managerId));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Ошибка сети");
    }
  };

  const handleToggleStatus = async (managerId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const action = newStatus === "blocked" ? "деактивировать" : "активировать";

    if (!confirm(`Вы уверены что хотите ${action} этого менеджера?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${managerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setManagers(
          managers.map((m) =>
            m.id === managerId ? { ...m, status: newStatus } : m
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка изменения статуса");
      }
    } catch (error) {
      console.error("Status change error:", error);
      alert("Ошибка сети");
    }
  };

  const activeCount = managers.filter((m) => m.status === "active").length;
  const inactiveCount = managers.filter((m) => m.status === "blocked").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">Загрузка менеджеров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
            Менеджеры
          </h1>
          <p className="text-gray-400 text-sm">
            Управление менеджерами системы • Активных: {activeCount} • Неактивных: {inactiveCount}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="min-h-[52px] px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.45)] active:scale-[0.97] flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            color: "#fff",
          }}
        >
          <Plus className="w-5 h-5" />
          Добавить менеджера
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <div className="text-3xl font-black text-white mb-1">{managers.length}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Всего менеджеров</div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <div className="text-3xl font-black" style={{ color: "#10b981" }}>
            {activeCount}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Активных</div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div className="text-3xl font-black" style={{ color: "#ef4444" }}>
            {inactiveCount}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Неактивных</div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#8b5cf6" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, телефону..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                background: "rgba(15,15,30,0.6)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(59,130,246,0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 30px rgba(59,130,246,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(59,130,246,0.3)";
                e.target.style.boxShadow = "0 0 20px rgba(59,130,246,0.1)";
              }}
            />
          </div>

          {/* Status filter */}
          <StyledSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(139,92,246,0.1)",
            }}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Неактивные</option>
          </StyledSelect>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          Найдено: {filteredManagers.length} из {managers.length}
        </div>
      </div>

      {/* Managers Grid */}
      {filteredManagers.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <Search className="w-10 h-10" style={{ color: "#9ca3af" }} />
          </div>
          <p className="text-gray-400 text-lg mb-2">Менеджеры не найдены</p>
          <p className="text-gray-500 text-sm">Попробуйте изменить фильтры или добавьте нового менеджера</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onDelete={handleDeleteManager}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Create Manager Modal */}
      {showCreateModal && (
        <CreateManagerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchManagers();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

