"use client";

import { Home, Calendar, Receipt, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Booking", href: "/booking" },
  { icon: Receipt, label: "Receipts", href: "/receipts" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Don't show bottom nav if user is not authenticated or loading
  if (status === "loading" || !session) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div 
        className="flex items-center justify-around px-2 py-3"
        style={{
          background: "linear-gradient(180deg, rgba(7,7,26,0.95), rgba(13,13,36,0.98))",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(59,130,246,0.1)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
                style={{
                  background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className="relative z-10 transition-all"
                  size={22}
                  style={{
                    color: isActive ? "#60a5fa" : "#9ca3af",
                    filter: isActive ? "drop-shadow(0 0 8px rgba(96,165,250,0.8))" : "none",
                  }}
                />

                {/* Label */}
                <span
                  className="relative z-10 text-[10px] font-bold uppercase tracking-wider transition-all"
                  style={{
                    color: isActive ? "#60a5fa" : "#6b7280",
                  }}
                >
                  {item.label}
                </span>

                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom safe area */}
      <div 
        className="w-full h-safe-bottom"
        style={{
          background: "linear-gradient(180deg, rgba(13,13,36,0.98), rgba(13,13,36,1))",
        }}
      />

      <style jsx>{`
        .h-safe-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </nav>
  );
}
