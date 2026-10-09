"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, DollarSign, Clock } from "lucide-react";
import { CreateTariffModal } from "@/components/admin/tariffs/CreateTariffModal";
import { RollingLoader } from "@/components/ui/RollingLoader";
import { EditTariffModal } from "@/components/admin/tariffs/EditTariffModal";
import { TariffCard } from "@/components/admin/tariffs/TariffCard";

interface Tariff {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  type: string;
  isActive: boolean;
  categoryId: string | null;
  category: {
    name: string;
  } | null;
  createdAt: string;
}

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [filteredTariffs, setFilteredTariffs] = useState<Tariff[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);

  useEffect(() => {
    fetchTariffs();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterTariffs();
  }, [tariffs, searchQuery, categoryFilter, statusFilter, typeFilter]);

  const fetchTariffs = async () => {
    try {
      const res = await fetch("/api/tariffs");
      const data = await res.json();
      setTariffs(data.tariffs || []);
    } catch (error) {
      console.error("Failed to fetch tariffs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterTariffs = () => {
    let filtered = [...tariffs];

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.categoryId === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((t) => t.isActive === isActive);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(query));
    }

    setFilteredTariffs(filtered);
  };

  const handleToggleActive = async (tariffId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/tariffs/${tariffId}/toggle`, {
        method: "PATCH",
      });

      if (res.ok) {
        setTariffs(
          tariffs.map((t) =>
            t.id === tariffId ? { ...t, isActive: !currentActive } : t
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка изменения статуса");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      alert("Ошибка сети");
    }
  };

  const handleDeleteTariff = async (tariffId: string) => {
    if (!confirm("Удалить тариф? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/tariffs/${tariffId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTariffs(tariffs.filter((t) => t.id !== tariffId));
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Ошибка сети");
    }
  };

  const activeCount = tariffs.filter((t) => t.isActive).length;
  const inactiveCount = tariffs.filter((t) => !t.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">Загрузка тарифов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
            Тарифы
          </h1>
          <p className="text-gray-400 text-sm">
            Управление тарифами • Всего: {tariffs.length} • Активных: {activeCount}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
          }}
        >
          <Plus className="w-5 h-5" />
          Создать тариф
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <div className="text-3xl font-black text-white mb-1">{tariffs.length}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Всего тарифов</div>
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
            border: "1px solid rgba(107,114,128,0.3)",
          }}
        >
          <div className="text-3xl font-black" style={{ color: "#6b7280" }}>
            {inactiveCount}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Неактивных</div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="text-3xl font-black" style={{ color: "#3b82f6" }}>
            {categories.length}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Категорий</div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(16,185,129,0.3)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#9ca3af" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#fff",
              }}
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#fff",
            }}
          >
            <option value="all">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#fff",
            }}
          >
            <option value="all">Все типы</option>
            <option value="hourly">Почасовой</option>
            <option value="package">Пакетный</option>
            <option value="night">Ночной</option>
            <option value="morning">Утренний</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#fff",
            }}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          Найдено: {filteredTariffs.length} из {tariffs.length}
        </div>
      </div>

      {/* Tariffs Grid */}
      {filteredTariffs.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <DollarSign className="w-10 h-10" style={{ color: "#10b981" }} />
          </div>
          <p className="text-gray-400 text-lg mb-2">Тарифы не найдены</p>
          <p className="text-gray-500 text-sm">Попробуйте изменить фильтры или создайте новый тариф</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTariffs.map((tariff) => (
            <TariffCard
              key={tariff.id}
              tariff={tariff}
              onEdit={setEditingTariff}
              onToggle={handleToggleActive}
              onDelete={handleDeleteTariff}
            />
          ))}
        </div>
      )}

      {/* Create Tariff Modal */}
      {showCreateModal && (
        <CreateTariffModal
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchTariffs();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Edit Tariff Modal */}
      {editingTariff && (
        <EditTariffModal
          tariff={editingTariff}
          categories={categories}
          onClose={() => setEditingTariff(null)}
          onSuccess={() => {
            fetchTariffs();
            setEditingTariff(null);
          }}
        />
      )}
    </div>
  );
}

