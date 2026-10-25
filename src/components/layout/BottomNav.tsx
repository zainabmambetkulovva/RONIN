"use client";

import { Home, Gamepad2, CalendarClock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/hooks/useSession";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_ITEMS = [
  { icon: Home, key: "cab.nav.home", href: "/dashboard" },
  { icon: Gamepad2, key: "cab.nav.book", href: "/booking" },
  { icon: CalendarClock, key: "cab.nav.bookings", href: "/bookings" },
  { icon: User, key: "cab.nav.profile", href: "/profile" },
];

/** Нижняя навигация личного кабинета на телефоне (только для вошедших пользователей). */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  if (status === "loading" || !session) return null;

  return (
    <nav
      aria-label={t("cab.nav.label")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-rn-line/70 bg-rn-void/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="flex items-stretch justify-around px-2 py-2">
        {NAV_ITEMS.map(({ icon: Icon, key, href }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return (
            <Link key={href} href={href} className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2" aria-current={active ? "page" : undefined}>
              {active && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-2xl border border-rn-violet/40 bg-gradient-to-br from-rn-violet/20 to-rn-magenta/15"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={`relative h-5 w-5 ${active ? "text-white drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" : "text-rn-muted"}`} />
              <span className={`relative text-[10px] font-semibold ${active ? "text-white" : "text-rn-muted"}`}>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
