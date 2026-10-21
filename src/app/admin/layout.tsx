"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Если это страница логина, не показываем sidebar и header
  if (pathname === "/admin/login") {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen text-white" style={{ background: "#03030a" }}>
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          {/* Mobile Sidebar - Drawer */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Drawer */}
              <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
                <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
              </div>
            </>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
