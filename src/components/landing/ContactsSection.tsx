"use client";

import { useState, type ReactNode } from "react";
import { Clock, MapPin, Phone, CreditCard, Banknote, ArrowLeftRight, QrCode, ExternalLink, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { club } from "@/config/club";
import { useBranding } from "@/contexts/BrandingContext";
import { Reveal, Section, SectionHeading } from "./primitives";
import { TikTokIcon, WhatsAppIcon } from "./brand-icons";

const PAY_ICONS = { card: CreditCard, cash: Banknote, transfer: ArrowLeftRight, qr: QrCode } as const;

export function ContactsSection() {
  const { t, language } = useLanguage();
  const brand = useBranding();

  return (
    <Section id="contacts">
      <SectionHeading eyebrow={t("contacts.eyebrow")} title={t("contacts.title")} />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <InfoCard icon={<MapPin className="h-5 w-5 text-rn-magenta" />} label={t("contacts.addressLabel")}>
              <p className="font-semibold text-white">{club.address[language]}</p>
              <p className="text-xs text-rn-muted">{club.district[language]}</p>
              <Landmarks text={club.landmarks[language]} />
              <a
                href={club.twoGis.firmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rn-cyan hover:text-white"
              >
                {t("contacts.open2gis")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.06}>
            <InfoCard icon={<Phone className="h-5 w-5 text-rn-cyan" />} label={t("contacts.phoneLabel")}>
              <a href={`tel:${club.phone.tel}`} className="font-display text-lg font-bold text-white hover:text-rn-cyan">
                {club.phone.display}
              </a>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/85">
                <Clock className="h-4 w-4 text-rn-purple" />
                <span className="text-rn-muted">{t("contacts.hoursLabel")}:</span> {t("contacts.hoursValue")}
              </div>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.12}>
            <InfoCard icon={<CreditCard className="h-5 w-5 text-rn-purple" />} label={t("contacts.paymentLabel")}>
              <ul className="grid grid-cols-2 gap-1.5">
                {club.paymentMethods.map((method) => {
                  const Icon = PAY_ICONS[method];
                  return (
                    <li key={method} className="flex items-center gap-1.5 rounded-lg border border-transparent bg-white/[0.03] px-2 py-1.5 text-xs text-white/85 transition-all duration-300 hover:border-rn-violet/40 hover:bg-white/[0.06] hover:text-white">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-rn-muted" />
                      {t(`contacts.pay.${method}`)}
                    </li>
                  );
                })}
              </ul>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.18}>
            <InfoCard icon={<Instagram className="h-5 w-5 text-rn-pink" />} label={t("contacts.socialsLabel")}>
              <div className="flex flex-wrap gap-2">
                {brand.socials.instagram && (
                  <SocialLink href={brand.socials.instagram} label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </SocialLink>
                )}
                {brand.socials.tiktok && (
                  <SocialLink href={brand.socials.tiktok} label="TikTok">
                    <TikTokIcon className="h-5 w-5" />
                  </SocialLink>
                )}
                {brand.socials.whatsapp && (
                  <SocialLink href={brand.socials.whatsapp} label="WhatsApp">
                    <WhatsAppIcon className="h-5 w-5" />
                  </SocialLink>
                )}
              </div>
            </InfoCard>
          </Reveal>
        </div>

        {/* На десктопе карта ровно по высоте блока карточек */}
        <Reveal delay={0.1} className="h-full">
          <div className="relative h-[260px] overflow-hidden rounded-2xl border border-rn-line bg-rn-surface sm:h-[300px] lg:h-full lg:min-h-[280px]">
            <iframe
              src={club.twoGis.widgetSrc}
              title={t("contacts.mapTitle")}
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.9)]"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function InfoCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-rn-line bg-rn-surface p-4 shadow-[0_0_0_rgba(139,92,246,0)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-rn-violet/60 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.55)]">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-rn-violet/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative mb-2.5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.08]">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rn-muted">{label}</span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-rn-line bg-white/[0.03] text-white transition hover:-translate-y-0.5 hover:border-rn-magenta hover:shadow-[0_0_24px_rgba(217,70,239,0.4)]"
    >
      {children}
    </a>
  );
}

/** Ориентиры: одна строка, по кнопке — полностью. */
function Landmarks({ text }: { text: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <p className={`text-[11px] text-rn-muted/80 ${open ? "" : "line-clamp-1"}`}>{text}</p>
      {text.length > 50 && (
        <button type="button" onClick={() => setOpen(!open)} className="text-[11px] font-semibold text-rn-cyan hover:text-white">
          {open ? t("contacts.less") : t("contacts.more")}
        </button>
      )}
    </div>
  );
}
