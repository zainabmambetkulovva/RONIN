"use client";

import { useState, useEffect } from "react";
import { Search, Monitor, Users, Clock, CheckCircle } from "lucide-react";
import { BookingSearchResult } from "./BookingSearchResult";
import { QuickStats } from "./QuickStats";

export function ManagerDashboard() {
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.length !== 5) {
      setError("Код должен содержать 5 цифр");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const res = await fetch(`/api/admin/bookings?code=${searchCode}`);
      const data = await res.json();
      
      if (data.bookings && data.bookings.length > 0) {
        setSearchResult(data.bookings[0]);
      } else {
        setError("Бронирование не найдено");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Ошибка поиска");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingUpdate = () => {
    // Refresh search result
    if (searchCode.length === 5) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
          Панель Менеджера
        </h1>
        <p className="text-gray-400">Поиск бронирований и управление</p>
      </div>

      {/* Search Card */}
      <div
        className="rounded-2xl p-8 mb-8"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(139,92,246,0.2)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <Search className="w-6 h-6" style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase">Поиск по коду</h2>
            <p className="text-sm text-gray-400">Введите 5-значный код бронирования</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              setSearchCode(value);
            }}
            placeholder="12345"
            maxLength={5}
            className="flex-1 px-6 py-4 rounded-xl text-2xl font-black text-center tracking-widest transition-all focus:scale-105"
            style={{
              background: "rgba(15,15,30,0.8)",
              border: "2px solid rgba(139,92,246,0.3)",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            disabled={loading || searchCode.length !== 5}
            className="px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              color: "#fff",
            }}
          >
            {loading ? "Поиск..." : "Найти"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-lg text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}
      </div>

      {/* Search Result */}
      {searchResult && <BookingSearchResult booking={searchResult} onUpdate={handleBookingUpdate} />}

      {/* Quick Stats */}
      <QuickStats />
    </div>
  );
}
