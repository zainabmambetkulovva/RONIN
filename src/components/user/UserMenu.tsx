"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
          {user.image ? (
            <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-white font-bold text-sm hidden md:block">
          {user.name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 glass-card rounded-xl border border-purple-500/30 overflow-hidden z-50"
          >
            <button
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
            >
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Профиль</span>
            </button>
            <button
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Настройки</span>
            </button>
            <div className="h-px bg-white/10" />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Выйти</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
