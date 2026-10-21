"use client";

import { useState, useEffect } from "react";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string;
}

export interface Session {
  user: SessionUser;
}

/**
 * Custom hook to check user session
 * Replaces next-auth useSession
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user/profile');
        
        if (response.ok) {
          const userData = await response.json();
          setSession({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              image: userData.avatar || userData.image,
              role: userData.role
            }
          });
          setStatus("authenticated");
        } else {
          setSession(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        setSession(null);
        setStatus("unauthenticated");
      }
    };

    checkSession();
  }, []);

  return { data: session, status };
}
