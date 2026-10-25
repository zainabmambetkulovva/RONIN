"use client";

import type { ReactNode } from "react";
import { Clock, MapPin, Phone, CreditCard, Banknote, ArrowLeftRight, QrCode, ExternalLink, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { club } from "@/config/club";
import { Reveal, Section, SectionHeading } from "./primitives";
import { TikTokIcon, WhatsAppIcon } from "./brand-icons";

const PAY_ICONS = { card: CreditCard, cash: Banknote, transfer: ArrowLeftRight, qr: QrCode } as const;

export function ContactsSection() {
  const { t, language } = useLanguage();

  return (
    <Section id="contacts">
      <SectionHeading eyebrow={t("contacts.eyebrow")} title={t("contacts.title")} />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal>
            <InfoCard icon={<MapPin className="h-5 w-5 text-rn-magenta" />} label={t("contacts.addressLabel")}>
              <p className="text-lg font-semibold text-white">{club.address[language]}</p>
              <p className="text-sm text-rn-muted">{club.district[language]}</p>
              <p className="mt-2 text-xs text-rn-muted/80">{club.landmarks[language]}</p>
              <a
                href={club.twoGis.firmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rn-cyan hover:text-white"
              >
                {t("contacts.open2gis")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.06}>
            <InfoCard icon={<Phone className="h-5 w-5 text-rn-cyan" />} label={t("contacts.phoneLabel")}>
              <a href={`tel:${club.phone.tel}`} className="font-display text-xl font-bold text-white hover:text-rn-cyan">
                {club.phone.display}
              </a>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
                <Clock className="h-4 w-4 text-rn-purple" />
                <span className="text-rn-muted">{t("contacts.hoursLabel")}:</span> {t("contacts.hoursValue")}
              </div>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.12}>
            <InfoCard icon={<CreditCard className="h-5 w-5 text-rn-purple" />} label={t("contacts.paymentLabel")}>
              <ul className="grid grid-cols-2 gap-2">
                {club.paymentMethods.map((method) => {
                  const Icon = PAY_ICONS[method];
                  return (
                    <li key={method} className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-sm text-white/85">
                      <Icon className="h-4 w-4 text-rn-muted" />
                      {t(`contacts.pay.${method}`)}
                    </li>
                  );
                })}
              </ul>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.18}>
            <InfoCard icon={<Instagram className="h-5 w-5 text-rn-pink" />} label={t("contacts.socialsLabel")}>
              <div className="flex flex-wrap gap-3">
                <SocialLink href={club.socials.instagram} label="Instagram">
                  <Instagram className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={club.socials.tiktok} label="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={club.socials.whatsapp} label="WhatsApp">
                  <WhatsAppIcon className="h-5 w-5" />
                </SocialLink>
              </div>
            </InfoCard>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative h-[260px] overflow-hidden sm:h-[300px] rounded-3xl border border-rn-line bg-rn-surface">
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
    <div className="h-full rounded-3xl border border-rn-line bg-rn-surface p-6 transition hover:border-rn-violet/50">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04]">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rn-muted">{label}</span>
      </div>
      {children}
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
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rn-line bg-white/[0.03] text-white transition hover:-translate-y-0.5 hover:border-rn-magenta hover:shadow-[0_0_24px_rgba(217,70,239,0.4)]"
    >
      {children}
    </a>
  );
}
