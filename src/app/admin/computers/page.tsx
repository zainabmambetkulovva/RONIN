"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ComputersTable } from "@/components/admin/ComputersTable";
import { RollingLoader } from "@/components/ui/RollingLoader";

interface Computer {
  id: string;
  number: number;
  name: string;
  status: string;
  specs: any;
  bookings: any[];
}

export default function ComputersPage() {
  const { t } = useLanguage();
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComputers();
  }, []);

  const fetchComputers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/computers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setComputers(data.computers || []);
    } catch (error) {
      console.error("Failed to fetch computers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">{t("admin.loading")}</p>
        </div>
      </div>
    );
  }

  // Статистика
  const stats = {
    total: computers.length,
    available: computers.filter((c) => c.status === "available" && c.bookings.length === 0).length,
    occupied: computers.filter((c) => c.bookings.length > 0).length,
    maintenance: computers.filter((c) => c.status === "maintenance").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t("admin.computersPage")}</h1>
        <p className="text-gray-400">{t("admin.computersManagement")}</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("admin.totalComputers")}</div>
          <div className="text-3xl font-black text-white">{stats.total}</div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("admin.availableComputers")}</div>
          <div className="text-3xl font-black" style={{ color: "#22c55e" }}>
            {stats.available}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("admin.occupiedComputers")}</div>
          <div className="text-3xl font-black" style={{ color: "#ef4444" }}>
            {stats.occupied}
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
            border: "1px solid rgba(251,146,60,0.3)",
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("admin.maintenanceComputers")}</div>
          <div className="text-3xl font-black" style={{ color: "#fb923c" }}>
            {stats.maintenance}
          </div>
        </div>
      </div>

      {/* Таблица компьютеров */}
      <ComputersTable computers={computers} />
    </div>
  );
}
