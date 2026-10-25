"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, Clock, MapPin, Monitor, Phone, Receipt, User } from "lucide-react";
import { CabinetShell, Panel } from "@/components/cabinet/CabinetShell";
import { StatusChip, bookingView } from "@/components/cabinet/BookingStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api-client";
import { formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import { useClubData } from "@/components/landing/useClubData";
import { club } from "@/config/club";
import type { BookingDTO } from "@/types/api";

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { data: session } = useSession();
  const clubData = useClubData();
  const [bookings, setBookings] = useState<BookingDTO[] | null>(null);

  useEffect(() => {
    api.myBookings().then((r) => setBookings(r.bookings)).catch(() => setBookings([]));
  }, []);

  // Ближайшая актуальная бронь (идёт сейчас, подтверждена или ждёт оплаты)
  const next = useMemo(() => {
    const relevant = (bookings ?? []).filter((b) => ["active", "confirmed", "awaiting_payment", "payment_failed", "needs_attention"].includes(bookingView(b)));
    return relevant.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))[0] ?? null;
  }, [bookings]);

  const halls = useMemo(() => {
    if (clubData.status !== "ready") return [];
    const { categories, computers, tariffs } = clubData.data;
    return categories
      .map((c) => {
        const pcs = computers.filter((p) => p.categoryId === c.id);
        const prices = tariffs.filter((tr) => tr.categoryId === c.id).map((tr) => tr.price);
        return { id: c.id, name: c.name, total: pcs.length, free: pcs.filter((p) => p.availableForSlot).length, from: prices.length ? Math.min(...prices) : null };
      })
      .filter((h) => h.total > 0)
      .sort((a, b) => (a.from ?? 0) - (b.from ?? 0));
  }, [clubData]);

  const firstName = session?.user.name?.split(" ")[0];

  return (
    <CabinetShell wide>
      {/* Приветствие */}
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8 overflow-hidden rounded-[2rem] border border-rn-line bg-gradient-to-br from-rn-surface-2 via-rn-surface to-rn-void p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-10 bottom-0 top-0 hidden w-72 sm:block" aria-hidden>
          {club.heroCharacter && (
            <Image src={club.heroCharacter} alt="" fill sizes="288px" className="object-contain object-bottom opacity-80 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
          )}
        </div>
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rn-magenta/20 blur-3xl" aria-hidden />
        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-rn-cyan">{t("cab.home.eyebrow")}</p>
        <h1 className="relative mt-3 font-display text-3xl font-bold uppercase sm:text-5xl">
          {t("cab.home.hello")}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="relative mt-3 max-w-lg text-rn-muted">{t("cab.home.subtitle")}</p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link href="/booking" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rn-magenta via-rn-purple to-rn-electric px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(217,70,239,0.4)]">
            {t("nav.book")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/bookings" className="inline-flex items-center gap-2 rounded-2xl border border-rn-line px-6 py-3 text-sm font-semibold hover:border-rn-violet">
            <CalendarClock className="h-4 w-4" /> {t("cab.nav.bookings")}
          </Link>
          <Link href="/profile" className="inline-flex items-center gap-2 rounded-2xl border border-rn-line px-6 py-3 text-sm font-semibold hover:border-rn-violet">
            <User className="h-4 w-4" /> {t("cab.nav.profile")}
          </Link>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Ближайшая бронь */}
        <Panel>
          <h2 className="mb-4 font-display text-lg font-bold uppercase">{t("cab.home.next")}</h2>
          {!bookings && <div className="h-28 animate-pulse rounded-2xl bg-white/5" />}
          {bookings && !next && (
            <div className="rounded-2xl border border-dashed border-rn-line p-6 text-center">
              <p className="text-rn-muted">{t("cab.home.noBooking")}</p>
              <Link href="/booking" className="mt-3 inline-block font-semibold text-rn-cyan hover:text-white">
                {t("nav.book")}
              </Link>
            </div>
          )}
          {next && (
            <div className="rounded-2xl bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-display text-xl font-bold">
                  <Monitor className="h-5 w-5 text-rn-purple" /> {t("cab.seat.pc")} № {next.computer.number}
                  <span className="text-sm font-normal text-rn-muted">· {next.computer.category.name}</span>
                </div>
                <StatusChip view={bookingView(next)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
                <span>{formatDate(next.startAt, language, { weekday: "long" })}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rn-muted" /> {formatTimeRange(next.startAt, next.endAt, language)}
                </span>
                <span>{formatMoney(next.price)}</span>
              </div>
              <Link
                href={["confirmed", "active", "needs_attention"].includes(bookingView(next)) ? `/booking-success?bookingId=${next.id}` : "/bookings"}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rn-cyan hover:text-white"
              >
                <Receipt className="h-4 w-4" /> {["confirmed", "active", "needs_attention"].includes(bookingView(next)) ? t("cab.bookings.receipt") : t("cab.bookings.pay")}
              </Link>
            </div>
          )}
        </Panel>

        {/* Залы: свободно сейчас и цены «от» */}
        <Panel>
          <h2 className="mb-4 font-display text-lg font-bold uppercase">{t("cab.home.halls")}</h2>
          <ul className="space-y-3">
            {clubData.status === "loading" && [0, 1, 2].map((i) => <li key={i} className="h-14 animate-pulse rounded-2xl bg-white/5" />)}
            {halls.map((h) => (
              <li key={h.id}>
                <Link href={`/booking?categoryId=${h.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]">
                  <span>
                    <span className="block font-semibold">{h.name}</span>
                  </span>
                  <span className="text-right text-sm">
                    <span className="font-display text-lg font-bold text-emerald-300">{h.free}</span>
                    <span className="text-rn-muted"> / {h.total}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-rn-muted">{t("pcs.freeNow")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* О клубе */}
      <Panel className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <a href={club.twoGis.firmUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
          <MapPin className="h-5 w-5 text-rn-magenta" />
          <span className="text-white/85">{club.address[language]}</span>
        </a>
        <a href={`tel:${club.phone.tel}`} className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-rn-cyan" />
          <span className="text-white/85">{club.phone.display}</span>
        </a>
        <span className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-rn-purple" />
          <span className="text-white/85">{t("contacts.hoursValue")}</span>
        </span>
      </Panel>
    </CabinetShell>
  );
}
