"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  UsersIcon,
  MonitorIcon,
  CalendarIcon,
  CreditCardIcon,
  GamepadIcon,
  UserCogIcon,
  SettingsIcon,
  LogOutIcon,
} from "@/components/ui/icons";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    label: "Пользователи",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    label: "Компьютеры",
    href: "/admin/computers",
    icon: MonitorIcon,
  },
  {
    label: "Бронирования",
    href: "/admin/bookings",
    icon: CalendarIcon,
  },
  {
    label: "Тарифы",
    href: "/admin/tariffs",
    icon: CreditCardIcon,
  },
  {
    label: "Игры",
    href: "/admin/games",
    icon: GamepadIcon,
  },
  {
    label: "Менеджеры",
    href: "/admin/managers",
    icon: UserCogIcon,
  },
  {
    label: "Настройки",
    href: "/admin/settings",
    icon: SettingsIcon,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="w-64 border-r flex flex-col"
      style={{
        background: "linear-gradient(180deg, #05050f 0%, #0a0a1a 100%)",
        borderColor: "rgba(59,130,246,0.12)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: "rgba(59,130,246,0.12)" }}>
        <Link href="/admin" className="flex items-center gap-2">
          <span
            className="text-2xl font-black tracking-widest"
            style={{
              background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
            }}
          >
            RONIN
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(59,130,246,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{
              background: "rgba(59,130,246,0.15)",
              color: "#60a5fa",
            }}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2 px-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Основное
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  active
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
              style={
                active
                  ? {
                      background: "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
                      boxShadow: "0 0 20px rgba(59,130,246,0.15)",
                    }
                  : undefined
              }
            >
              <Icon className="w-5 h-5" style={{ color: active ? "#60a5fa" : "currentColor" }} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t" style={{ borderColor: "rgba(59,130,246,0.08)" }}>
          <button
            onClick={() => {
              // TODO: Implement logout
              console.log("Logout");
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </nav>

      {/* Footer badge */}
      <div
        className="px-4 py-3 border-t"
        style={{
          borderColor: "rgba(59,130,246,0.08)",
          background: "rgba(139,92,246,0.05)",
        }}
      >
        <p className="text-xs text-gray-500 text-center">
          RONIN Admin Panel v1.0
        </p>
      </div>
    </aside>
  );
}
