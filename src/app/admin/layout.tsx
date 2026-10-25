"use client";

import { usePathname } from "next/navigation";
import { StaffShell } from "@/components/admin/StaffShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Страница входа — без оболочки и проверки сессии
  if (pathname === "/admin/login") return <>{children}</>;
  return <StaffShell>{children}</StaffShell>;
}
