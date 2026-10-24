"use client";

import { useState, useEffect, useCallback } from "react";
import type { CurrentUserDTO } from "@/types/api";

export interface SessionUser {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  avatar?: string | null;
  phone?: string | null;
  role?: string;
  needsSetup?: boolean;
}

export interface Session {
  user: SessionUser;
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

function toSession(user: CurrentUserDTO): Session {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      needsSetup: user.needsSetup,
    },
  };
}

/**
 * Текущая сессия пользователя (cookie `session-token`, проверяется сервером через /api/user/profile).
 * `update()` перечитывает профиль с сервера, например после его изменения.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const load = useCallback(async (): Promise<Session | null> => {
    try {
      const response = await fetch("/api/user/profile", { credentials: "include", cache: "no-store" });
      if (!response.ok) {
        setSession(null);
        setStatus("unauthenticated");
        return null;
      }
      const data: { user: CurrentUserDTO } = await response.json();
      const next = toSession(data.user);
      setSession(next);
      setStatus("authenticated");
      return next;
    } catch (error) {
      console.error("[useSession] Error:", error);
      setSession(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Аргумент принимается для совместимости со старыми вызовами и игнорируется:
  // источник правды — сервер
  const update = useCallback((_data?: unknown) => load(), [load]);

  return { data: session, status, update };
}

/**
 * Выход: удаляет cookie сессии на сервере и перенаправляет пользователя.
 */
export async function signOut(options?: { callbackUrl?: string }) {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch (error) {
    console.error("[signOut] Error:", error);
  } finally {
    window.location.href = options?.callbackUrl || "/";
  }
}
