"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RollingLoader } from "@/components/ui/RollingLoader";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      // Сессия персонала хранится в httpOnly cookie и проверяется сервером
      const res = await fetch("/api/admin/auth/verify-token");

      if (pathname === "/admin/login") {
        if (res.ok) {
          router.push("/admin");
          return;
        }
        setIsAuthenticated(true);
        return;
      }

      if (!res.ok) {
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      if (pathname !== "/admin/login") router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
