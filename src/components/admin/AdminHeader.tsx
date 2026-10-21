"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header
      className="h-16 border-b flex items-center justify-between px-4 md:px-6"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderColor: "rgba(59,130,246,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-400 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      <LanguageSwitcher />
    </header>
  );
}
