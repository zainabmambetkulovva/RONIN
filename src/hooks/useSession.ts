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
        const response = await fetch('/api/user/profile', {
          credentials: 'include' // Important for cookies
        });
        
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
        console.error('[useSession] Error:', error);
        setSession(null);
        setStatus("unauthenticated");
      }
    };

    checkSession();
  }, []);

  return { data: session, status };
}

/**
 * Custom signOut function
 * Replaces next-auth signOut
 */
export async function signOut(options?: { callbackUrl?: string }) {
  try {
    // Call logout API
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    // Redirect to callback URL or home
    window.location.href = options?.callbackUrl || '/';
  } catch (error) {
    console.error('[signOut] Error:', error);
    // Even on error, redirect
    window.location.href = options?.callbackUrl || '/';
  }
}
