"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBranding } from "@/contexts/BrandingContext";
import {
  LayoutDashboard,
  CalendarDays,
  Monitor,
  Timer,
  Users,
  Wallet,
  Tags,
  UserCog,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Loader2,
  Gauge,
  Lock,
  Search,
  Bell,
  Settings,
} from "lucide-react";

export type StaffRole = "admin" | "manager";

export interface StaffUser {
  id: string;
  name: string;
  email: string | null;
  role: StaffRole;
}

const StaffContext = createContext<StaffUser | null>(null);

/** Текущий сотрудник (роль проверена сервером). */
export function useStaff() {
  const staff = useContext(StaffContext);
  if (!staff) throw new Error("useStaff must be used inside StaffShell");
  return staff;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: StaffRole[];
  group: "main" | "work" | "manage";
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, roles: ["admin"], group: "main" },
  { href: "/manager", label: "Панель менеджера", icon: Gauge, roles: ["admin", "manager"], group: "main" },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarDays, roles: ["admin", "manager"], group: "work" },
  { href: "/admin/computers", label: "Компьютеры", icon: Monitor, roles: ["admin", "manager"], group: "work" },
  { href: "/admin/sessions", label: "Игровые сессии", icon: Timer, roles: ["admin", "manager"], group: "work" },
  { href: "/admin/clients", label: "Клиенты", icon: Users, roles: ["admin", "manager"], group: "work" },
  { href: "/admin/payments", label: "Платежи", icon: Wallet, roles: ["admin"], group: "manage" },
  { href: "/admin/tariffs", label: "Тарифы", icon: Tags, roles: ["admin"], group: "manage" },
  { href: "/admin/managers", label: "Менеджеры", icon: UserCog, roles: ["admin"], group: "manage" },
  { href: "/admin/users", label: "Аккаунты", icon: ShieldCheck, roles: ["admin"], group: "manage" },
  { href: "/admin/settings", label: "Настройки", icon: Settings, roles: ["admin"], group: "manage" },
];

const GROUPS: Array<{ key: NavItem["group"]; label: string }> = [
  { key: "main", label: "Главное" },
  { key: "work", label: "Работа" },
  { key: "manage", label: "Управление" },
];

function allowedFor(pathname: string, role: StaffRole) {
  const item = [...NAV].sort((a, b) => b.href.length - a.href.length).find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  // Разделы, которых нет в меню (например, /admin/settings), — только для администратора
  return item ? item.roles.includes(role) : role === "admin";
}

/** Оболочка панели управления: проверка сессии сотрудника, меню по роли, шапка. */
export function StaffShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const brand = useBranding();

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/auth/verify-token", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => alive && setStaff(data.user))
      .catch(() => router.replace("/admin/login"));
    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const logout = useCallback(async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
  }, [router]);

  if (!staff) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-rn-void text-rn-muted">
        <Loader2 className="h-5 w-5 animate-spin" /> Проверка доступа…
      </div>
    );
  }

  const items = NAV.filter((n) => n.roles.includes(staff.role));
  const allowed = allowedFor(pathname, staff.role);

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Панель управления">
      <Link href={staff.role === "admin" ? "/admin" : "/manager"} className="flex items-center gap-3 px-5 py-5">
        <span className="relative h-9 w-9">
          <Image src={brand.logoUrl} unoptimized={brand.logoUrl.startsWith("/api/")} alt="" fill sizes="36px" className="object-contain" />
        </span>
        <span className="block font-display text-base font-black tracking-[0.18em] text-white">{brand.clubName}</span>
      </Link>
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {GROUPS.map((group) => {
          const groupItems = items.filter((i) => i.group === group.key);
          if (groupItems.length === 0) return null;
          return (
            <div key={group.key}>
              <p className="mb-1.5 px-3 text-xs text-rn-muted/80">{group.label}</p>
              <ul className="space-y-1">
                {groupItems.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active ? "bg-rn-violet text-white shadow-[0_8px_24px_-10px_rgba(139,92,246,0.8)]" : "text-rn-muted hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="p-3">
        <div className="mb-3 rounded-2xl border border-rn-violet/30 bg-gradient-to-br from-rn-violet/20 to-rn-magenta/10 p-4 text-center">
          <span className="relative mx-auto block h-10 w-10">
            <Image src={brand.logoUrl} unoptimized={brand.logoUrl.startsWith("/api/")} alt="" fill sizes="40px" className="object-contain" />
          </span>
          <p className="mt-2 text-xs text-white/85">Работаем 24/7 — все данные в реальном времени</p>
          <Link href="/" className="mt-2 inline-block text-xs font-semibold text-rn-cyan hover:text-white">
            Открыть сайт →
          </Link>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rn-muted transition hover:bg-white/[0.04] hover:text-rn-pink">
          <LogOut className="h-[18px] w-[18px]" /> Выйти
        </button>
      </div>
    </nav>
  );

  return (
    <StaffContext.Provider value={staff}>
      <div className="min-h-screen bg-rn-void text-white">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-rn-line/70 bg-rn-night/95 lg:block">{sidebar}</aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <button className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" />
            <aside className="absolute inset-y-0 left-0 w-72 border-r border-rn-line bg-rn-night">
              <button onClick={() => setMenuOpen(false)} className="absolute right-3 top-4 text-rn-muted" aria-label="Закрыть меню">
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-rn-line/70 bg-rn-void/85 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button onClick={() => setMenuOpen(true)} className="rounded-lg border border-rn-line p-2 lg:hidden" aria-label="Открыть меню">
              <Menu className="h-5 w-5" />
            </button>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rn-violet to-rn-magenta font-display text-sm font-bold text-white">
              {staff.name.trim().charAt(0).toUpperCase()}
            </span>
            <p className="min-w-0 truncate text-sm font-semibold text-white">Добро пожаловать, {staff.name}!</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q")?.toString().trim();
                if (q) window.location.href = `/admin/clients?q=${encodeURIComponent(q)}`;
              }}
              className="ml-auto hidden w-full max-w-sm md:block"
              role="search"
            >
              <label className="relative block">
                <span className="sr-only">Поиск клиента</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rn-muted" />
                <input
                  name="q"
                  placeholder="Поиск клиента: имя, телефон, email"
                  className="w-full rounded-full border border-rn-line bg-rn-surface/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-rn-muted focus:border-rn-violet"
                />
              </label>
            </form>
            <Link
              href="/admin/bookings"
              className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rn-line text-rn-muted transition hover:text-white md:ml-0"
              aria-label="Бронирования"
            >
              <Bell className="h-[18px] w-[18px]" />
            </Link>
          </header>
          <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {allowed ? (
              children
            ) : (
              <div className="mx-auto mt-20 max-w-md rounded-3xl border border-rn-line bg-rn-surface p-8 text-center">
                <Lock className="mx-auto h-10 w-10 text-rn-pink" />
                <h1 className="mt-4 font-display text-xl font-bold uppercase">Нет доступа</h1>
                <p className="mt-2 text-sm text-rn-muted">Этот раздел доступен только администратору.</p>
                <Link href="/manager" className="mt-6 inline-block text-rn-cyan hover:text-white">
                  Панель менеджера
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </StaffContext.Provider>
  );
}
