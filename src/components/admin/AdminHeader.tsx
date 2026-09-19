"use client";

import { useState } from "react";
import { SearchIcon, BellIcon } from "@/components/ui/icons";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className="h-16 border-b flex items-center px-6 gap-6"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderColor: "rgba(59,130,246,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#60a5fa" }}
          />
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2"
            style={{
              background: "rgba(15,15,30,0.6)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
            onFocus={(e) => (e.target.style.outline = "2px solid rgba(59,130,246,0.5)")}
            onBlur={(e) => (e.target.style.outline = "none")}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-all hover:bg-white/5"
          style={{
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <BellIcon className="w-5 h-5" style={{ color: "#60a5fa" }} />
          {/* Badge */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: "0 0 8px rgba(239,68,68,0.6)",
            }}
          >
            3
          </span>
        </button>

        {/* Greeting */}
        <div className="hidden md:block text-right">
          <p className="text-xs text-gray-400">Welcome!</p>
          <p className="text-sm font-bold text-white">{user.name}</p>
        </div>
      </div>
    </header>
  );
}
