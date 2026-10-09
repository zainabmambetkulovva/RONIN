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
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        // Если на странице логина, пропускаем
        if (pathname === "/admin/login") {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Перенаправляем на логин
        router.push("/admin/login");
        return;
      }

      // Проверяем токен на сервере
      const res = await fetch("/api/admin/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Токен невалидный
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      // Если на странице логина и уже авторизован, перенаправляем в админку
      if (pathname === "/admin/login") {
        router.push("/admin");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
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
