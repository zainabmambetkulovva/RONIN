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
// Один запрос профиля на всю страницу: шапка, кабинет, футер и т. д. используют общий результат (кэш 30 с)
let shared: { at: number; promise: Promise<Session | null> } | null = null;
const listeners = new Set<(s: Session | null) => void>();

async function fetchSession(): Promise<Session | null> {
  try {
    const response = await fetch("/api/user/profile", { credentials: "include", cache: "no-store" });
    if (!response.ok) return null;
    const data: { user: CurrentUserDTO } = await response.json();
    return toSession(data.user);
  } catch (error) {
    console.error("[useSession] Error:", error);
    return null;
  }
}

function getSession(force = false): Promise<Session | null> {
  if (force || !shared || Date.now() - shared.at > 30_000) {
    const promise = fetchSession();
    shared = { at: Date.now(), promise };
    promise.then((s) => listeners.forEach((l) => l(s)));
  }
  return shared.promise;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const apply = useCallback((next: Session | null) => {
    setSession(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    listeners.add(apply);
    getSession().then(apply);
    return () => {
      listeners.delete(apply);
    };
  }, [apply]);

  // Аргумент принимается для совместимости со старыми вызовами и игнорируется:
  // источник правды — сервер
  const update = useCallback((_data?: unknown) => getSession(true), []);

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
    shared = null;
    window.location.href = options?.callbackUrl || "/";
  }
}
