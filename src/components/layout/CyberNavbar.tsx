"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBranding } from "@/contexts/BrandingContext";
import { useSession } from "@/hooks/useSession";

const NAV_LINKS = [
  { id: "advantages", key: "nav.advantages" },
  { id: "tariffs", key: "nav.tariffs" },
  { id: "computers", key: "nav.computers" },
  { id: "games", key: "nav.games" },
  { id: "reviews", key: "nav.reviews" },
  { id: "contacts", key: "nav.contacts" },
] as const;

/** Шапка сайта. Ссылки ведут на секции главной страницы и работают с любой страницы. */
export function CyberNavbar() {
  const brand = useBranding();
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Подсветка текущей секции на главной
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Блокировка прокрутки под открытым мобильным меню
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-rn-line/70 bg-rn-void/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative h-9 w-9 lg:h-10 lg:w-10">
            <Image src={brand.logoUrl} unoptimized={brand.logoUrl.startsWith("/api/")} alt="" fill sizes="40px" priority className="object-contain transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
          </span>
          <span className="hidden font-display text-lg font-black tracking-[0.18em] text-white min-[380px]:inline lg:text-xl">{brand.clubName}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ id, key }) => (
            <a
              key={id}
              href={href(id)}
              className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                active === id ? "text-white" : "text-rn-muted hover:text-white"
              }`}
            >
              {active === id && (
                <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/[0.07]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{t(key)}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          {status !== "loading" &&
            (session ? (
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full border border-rn-line bg-rn-surface/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white transition hover:border-rn-violet md:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rn-violet to-rn-magenta text-xs font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </span>
                <span className="max-w-[120px] truncate">{session.user.name || t("nav.profile")}</span>
              </Link>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-white/85 transition hover:text-white">
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rn-brand-gradient rounded-full px-5 py-2 text-sm font-bold text-white shadow-[0_0_24px_rgba(217,70,239,0.35)] transition hover:shadow-[0_0_36px_rgba(217,70,239,0.6)]"
                >
                  {t("nav.register")}
                </Link>
              </div>
            ))}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t("nav.menu")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-rn-line bg-rn-surface/70 text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-rn-line/60 bg-rn-void/95 px-4 pb-10 pt-6 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map(({ id, key }, i) => (
                <motion.a
                  key={id}
                  href={href(id)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b border-rn-line/50 py-4 font-display text-xl font-bold uppercase text-white"
                >
                  {t(key)}
                </motion.a>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              {session ? (
                <Link href="/profile" onClick={() => setOpen(false)} className="rounded-2xl border border-rn-line py-4 text-center font-semibold text-white">
                  {t("nav.profile")}
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-rn-line py-4 text-center font-semibold text-white">
                    {t("nav.login")}
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="rounded-2xl border border-rn-violet/60 bg-rn-violet/10 py-4 text-center font-semibold text-white">
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
