"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AdminHeader() {
  return (
    <header
      className="h-16 border-b flex items-center justify-end px-6"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderColor: "rgba(59,130,246,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <LanguageSwitcher />
    </header>
  );
}
