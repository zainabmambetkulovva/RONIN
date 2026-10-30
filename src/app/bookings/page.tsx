"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Loader2, Monitor, Plus, Receipt, AlertCircle } from "lucide-react";
import { CabinetShell, PageTitle, Panel } from "@/components/cabinet/CabinetShell";
import { StatusChip, bookingView, useCountdown, type BookingView } from "@/components/cabinet/BookingStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, ApiClientError } from "@/lib/api-client";
import { formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import { BOOKING_HOLD_MINUTES } from "@/server/config";
import type { BookingDTO } from "@/types/api";
import { translateTariffName } from "@/lib/tariff-name";

type Tab = "upcoming" | "active" | "history";

const TAB_OF: Record<BookingView, Tab> = {
  awaiting_payment: "upcoming",
  payment_failed: "upcoming",
  confirmed: "upcoming",
  needs_attention: "upcoming",
  active: "active",
  completed: "history",
  cancelled: "history",
  hold_expired: "history",
};

export default function MyBookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [payError, setPayError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.myBookings();
      setBookings(res.bookings);
    } catch {
      setError(t("cab.bookings.loadError"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
    setPayError(new URLSearchParams(window.location.search).get("payError") === "1");
  }, [load]);

  const grouped = useMemo(() => {
    const g: Record<Tab, BookingDTO[]> = { upcoming: [], active: [], history: [] };
    for (const b of bookings ?? []) g[TAB_OF[bookingView(b)]].push(b);
    g.upcoming.sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
    g.history.sort((a, b) => +new Date(b.startAt) - +new Date(a.startAt));
    return g;
  }, [bookings]);

  // Если активных нет — сразу показываем ближайшие
  useEffect(() => {
    if (bookings && grouped.active.length > 0) setTab("active");
  }, [bookings, grouped.active.length]);

  const tabs: Tab[] = ["upcoming", "active", "history"];

  return (
    <CabinetShell>
      <PageTitle
        eyebrow={t("cab.bookings.eyebrow")}
        title={t("cab.bookings.title")}
        action={
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-gradient-to-r from-rn-magenta to-rn-violet px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(217,70,239,0.35)]"
          >
            <Plus className="h-4 w-4" /> {t("cab.bookings.new")}
          </Link>
        }
      />

      {payError && (
        <Panel className="mb-6 flex gap-3 border-amber-400/40 text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{t("cab.bookings.payErrorBanner").replace("{min}", String(BOOKING_HOLD_MINUTES))}</span>
        </Panel>
      )}

      {/* Три вкладки одинаковой ширины в один ряд — ни одна не обрезается */}
      <div role="tablist" className="mb-4 grid grid-cols-3 gap-1.5 py-2 sm:flex sm:gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`relative min-w-0 rounded-full px-2 py-2.5 text-[13px] font-semibold transition sm:shrink-0 sm:px-5 sm:text-sm ${tab === key ? "text-white" : "text-rn-muted hover:text-white"}`}
          >
            {tab === key && <motion.span layoutId="bookings-tab" className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-rn-violet/50" />}
            <span className="relative flex items-center justify-center gap-1.5 whitespace-nowrap">
              {t(`cab.bookings.tab.${key}`)}
              {bookings && <span className="text-xs text-rn-muted">{grouped[key].length}</span>}
            </span>
          </button>
        ))}
      </div>

      {error && <Panel className="border-rn-pink/40 text-rn-pink">{error}</Panel>}
      {!bookings && !error && (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl border border-rn-line bg-rn-surface/60" />
          ))}
        </div>
      )}

      {bookings && grouped[tab].length === 0 && (
        <Panel className="text-center">
          <p className="text-rn-muted">{t(`cab.bookings.empty.${tab}`)}</p>
          {tab !== "history" && (
            <Link href="/booking" className="mt-4 inline-block font-semibold text-rn-cyan hover:text-white">
              {t("nav.book")}
            </Link>
          )}
        </Panel>
      )}

      <div className="space-y-4">
        {bookings && grouped[tab].map((b) => <BookingCard key={b.id} booking={b} onChanged={load} />)}
      </div>
    </CabinetShell>
  );
}

function BookingCard({ booking, onChanged }: { booking: BookingDTO; onChanged: () => void }) {
  const { t, language } = useLanguage();
  const view = bookingView(booking);
  const unpaid = view === "awaiting_payment" || view === "payment_failed";
  const countdown = useCountdown(unpaid ? booking.holdExpiresAt : null);
  const [busy, setBusy] = useState<"pay" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setBusy("pay");
    setError(null);
    try {
      const { paymentUrl } = await api.payBooking(booking.id);
      window.location.href = paymentUrl;
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t("cab.book.errorGeneric"));
      setBusy(null);
    }
  };

  const cancel = async () => {
    if (!confirm(t("cab.bookings.cancelConfirm"))) return;
    setBusy("cancel");
    setError(null);
    try {
      await api.cancelBooking(booking.id);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t("cab.book.errorGeneric"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border bg-rn-surface/80 p-5 backdrop-blur sm:p-6 ${view === "active" ? "border-emerald-400/40 shadow-[0_0_30px_rgba(52,211,153,0.15)]" : "border-rn-line"}`}
    >
      {/* Статус — всегда справа в той же строке, что и номер ПК (раньше переносился под заголовок) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 font-display text-lg font-bold uppercase">
            <Monitor className="h-5 w-5 shrink-0 text-rn-purple" />
            <span className="whitespace-nowrap">
              {t("cab.seat.pc")} № {booking.computer.number}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-rn-muted">
            {booking.computer.category.name} · № {booking.bookingNumber}
          </p>
        </div>
        <StatusChip view={view} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
        <Info icon={<CalendarDays className="h-4 w-4" />} value={formatDate(booking.startAt, language, { weekday: "short" })} />
        <Info icon={<Clock className="h-4 w-4" />} value={formatTimeRange(booking.startAt, booking.endAt, language)} />
        <Info icon={<Receipt className="h-4 w-4" />} value={translateTariffName(booking.tariff.name, language)} />
        <div className="font-display text-lg font-bold text-white sm:text-right">{formatMoney(booking.price)}</div>
      </div>

      {(unpaid || view === "confirmed" || view === "active" || view === "completed" || view === "needs_attention") && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rn-line pt-4">
          {unpaid && countdown.left > 0 && (
            <>
              <button
                onClick={pay}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rn-magenta to-rn-violet px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {busy === "pay" && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("cab.bookings.pay")}
              </button>
              <button onClick={cancel} disabled={busy !== null} className="rounded-xl border border-rn-line px-5 py-2.5 text-sm font-semibold text-rn-muted hover:text-white disabled:opacity-50">
                {busy === "cancel" ? <Loader2 className="h-4 w-4 animate-spin" /> : t("cab.bookings.cancel")}
              </button>
              <span className="text-xs text-amber-300">
                {t("cab.receipt.holdLeft")}: {countdown.label}
              </span>
            </>
          )}
          {(view === "confirmed" || view === "active" || view === "completed" || view === "needs_attention") && (
            <Link href={`/booking-success?bookingId=${encodeURIComponent(booking.id)}`} className="inline-flex items-center gap-2 rounded-xl border border-rn-line px-5 py-2.5 text-sm font-semibold text-white hover:border-rn-violet">
              <Receipt className="h-4 w-4" /> {view === "needs_attention" ? t("cab.bookings.details") : t("cab.bookings.receipt")}
            </Link>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-rn-pink">{error}</p>}
    </motion.article>
  );
}

function Info({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 text-white/85">
      <span className="text-rn-muted">{icon}</span>
      {value}
    </div>
  );
}
