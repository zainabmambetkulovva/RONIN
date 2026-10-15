"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Search, Trash2, Ban, CheckCircle } from "lucide-react";
import { CreateUserModal } from "@/components/admin/users/CreateUserModal";
import { RollingLoader } from "@/components/ui/RollingLoader";
import { UserCard } from "@/components/admin/users/UserCard";

interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  avatar: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch users");
      }
      
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      alert(`${t("admin.loadError")}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.phone?.includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t("admin.deleteConfirm"))) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || t("admin.deleteError"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(t("admin.networkError"));
    }
  };

  const handleBlockUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const confirmMsg = newStatus === "blocked" ? t("admin.blockConfirm") : t("admin.unblockConfirm");

    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || t("admin.statusError"));
      }
    } catch (error) {
      console.error("Status change error:", error);
      alert(t("admin.networkError"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">{t("admin.loadingUsers")}</p>
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
            {t("admin.users")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("admin.usersManagement")} • {t("admin.total")}: {users.length}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            color: "#fff",
          }}
        >
          <Plus className="w-5 h-5" />
          {t("admin.addUser")}
        </button>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder={t("admin.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(15,15,30,0.8)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#fff",
              }}
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#fff",
            }}
          >
            <option value="all">{t("admin.allRoles")}</option>
            <option value="client">{t("admin.clients")}</option>
            <option value="manager">{t("admin.managers")}</option>
            <option value="admin">{t("admin.admins")}</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#fff",
            }}
          >
            <option value="all">{t("admin.allStatuses")}</option>
            <option value="active">{t("admin.active")}</option>
            <option value="blocked">{t("admin.blocked")}</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          {t("admin.found")}: {filteredUsers.length} {t("admin.of")} {users.length}
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
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
          <p className="text-gray-400 text-lg mb-2">{t("admin.notFound")}</p>
          <p className="text-gray-500 text-sm">{t("admin.tryChangeFilters")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDeleteUser}
              onBlock={handleBlockUser}
            />
          ))}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchUsers();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

