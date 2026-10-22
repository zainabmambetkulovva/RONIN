"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { RollingLoader } from "@/components/ui/RollingLoader";

interface UserGuardProps {
  children: React.ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [session, status]);

  const checkAccess = () => {
    // Проверить есть ли admin токен
    const adminToken = localStorage.getItem("admin_token");
    
    if (adminToken) {
      // Админ не может заходить на страницы пользователей
      router.push("/admin");
      return;
    }

    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#03030a" }}>
        <div className="text-center">
          <RollingLoader />
          <p className="text-gray-400 mt-4">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
