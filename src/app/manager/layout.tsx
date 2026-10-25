"use client";

import { StaffShell } from "@/components/admin/StaffShell";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>;
}
