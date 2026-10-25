"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, Phone, Clock, ArrowUp } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useLanguage } from "@/contexts/LanguageContext";
import { club } from "@/config/club";
import { useBranding } from "@/contexts/BrandingContext";
import { TikTokIcon, WhatsAppIcon } from "@/components/landing/brand-icons";

const NAV = [
  { id: "advantages", key: "nav.advantages" },
  { id: "tariffs", key: "nav.tariffs" },
  { id: "computers", key: "nav.computers" },
  { id: "games", key: "nav.games" },
  { id: "reviews", key: "nav.reviews" },
  { id: "contacts", key: "nav.contacts" },
] as const;

/** Подвал сайта: логотип, навигация, контакты, соцсети. */
export function CyberFooter() {
  const brand = useBranding();
  // Нижнее меню на телефоне есть только после входа — только тогда нужен запас снизу
  const { status } = useSession();
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  const socials = [
    { href: brand.socials.instagram, label: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    { href: brand.socials.tiktok, label: "TikTok", icon: <TikTokIcon className="h-5 w-5" /> },
    { href: brand.socials.whatsapp, label: "WhatsApp", icon: <WhatsAppIcon className="h-5 w-5" /> },
  ];

  return (
    <footer className={`relative overflow-hidden border-t border-rn-line bg-rn-void pt-16 md:pb-8 ${status === "authenticated" ? "pb-24" : "pb-8"}`}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-rn-magenta/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-rn-violet/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-11 w-11">
              <Image src={brand.logoUrl} unoptimized={brand.logoUrl.startsWith("/api/")} alt="" fill sizes="44px" className="object-contain" />
            </span>
            <span className="font-display text-2xl font-black tracking-[0.18em] text-white">{brand.clubName}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-rn-muted">{t("hero.description")}</p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{t("footer.navigation")}</h4>
          <ul className="space-y-2.5">
            {NAV.map(({ id, key }) => (
              <li key={id}>
                <a href={`/#${id}`} className="text-sm text-rn-muted transition hover:text-white">
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{t("footer.account")}</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/booking" className="text-sm text-rn-muted transition hover:text-white">
                {t("nav.book")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-sm text-rn-muted transition hover:text-white">
                {t("nav.login")}
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-sm text-rn-muted transition hover:text-white">
                {t("nav.register")}
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-sm text-rn-muted transition hover:text-white">
                {t("nav.profile")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{t("footer.contacts")}</h4>
          <ul className="space-y-3 text-sm text-rn-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rn-magenta" />
              <span>
                {club.address[language]}
                <br />
                {club.district[language]}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rn-cyan" />
              <a href={`tel:${club.phone.tel}`} className="transition hover:text-white">
                {club.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rn-purple" />
              {t("contacts.hoursValue")}
            </li>
          </ul>
          {/* Соцсети — под контактами */}
          <div className="mt-6 flex gap-3">
            {socials.filter((s) => s.href).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rn-line bg-white/[0.03] text-white/85 transition hover:-translate-y-0.5 hover:border-rn-magenta hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-rn-line/60 px-4 pt-6 text-xs text-rn-muted sm:flex-row sm:px-6 lg:px-8">
        <span>
          © {year} {brand.clubName} · {club.city}. {t("footer.rights")}
        </span>
        <span className="font-display uppercase tracking-[0.3em] text-white/30">Play · Connect · Level up</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("footer.toTop")}
          title={t("footer.toTop")}
          className="group mt-2 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] active:scale-95 sm:mt-0"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
