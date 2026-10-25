"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, AlertTriangle, XCircle, Printer, CalendarClock, Phone } from "lucide-react";
import { CabinetShell, Panel } from "@/components/cabinet/CabinetShell";
import { StatusChip, bookingView, useCountdown } from "@/components/cabinet/BookingStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, ApiClientError } from "@/lib/api-client";
import { formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import { club } from "@/config/club";
import type { BookingDTO } from "@/types/api";

/** Сколько ждать подтверждения оплаты от Finik, прежде чем показать «пока не подтверждено». */
const POLL_MS = 3000;
const POLL_LIMIT_MS = 3 * 60_000;

export default function BookingSuccessPage() {
  const { t, language } = useLanguage();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("bookingId");
    if (id) setBookingId(id);
    else setError(t("cab.receipt.notFound"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    if (!bookingId) return null;
    try {
      const { booking } = await api.booking(bookingId);
      setBooking(booking);
      return booking;
    } catch (e) {
      setError(e instanceof ApiClientError && e.status === 404 ? t("cab.receipt.notFound") : t("cab.receipt.loadError"));
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // Опрос статуса, пока сервер не получил подтверждение оплаты
  useEffect(() => {
    if (!bookingId) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const poll = async () => {
      const b = await load();
      if (stopped || !b) return;
      const view = bookingView(b);
      if (view === "awaiting_payment") {
        if (Date.now() - startedAt.current < POLL_LIMIT_MS) timer = setTimeout(poll, POLL_MS);
        else setPollTimedOut(true);
      }
    };
    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [bookingId, load]);

  const view = booking ? bookingView(booking) : null;
  const paidAndValid = view === "confirmed" || view === "active" || view === "completed";
  const countdown = useCountdown(view === "awaiting_payment" || view === "payment_failed" ? booking?.holdExpiresAt ?? null : null);

  useEffect(() => {
    if (paidAndValid && booking) {
      QRCode.toDataURL(booking.bookingCode, { margin: 1, width: 240, color: { dark: "#0b0818", light: "#ffffff" } })
        .then(setQr)
        .catch(() => setQr(null));
    }
  }, [paidAndValid, booking]);

  const payAgain = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      const { paymentUrl } = await api.payBooking(booking.id);
      window.location.href = paymentUrl;
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : t("cab.book.errorGeneric"));
      setPaying(false);
    }
  };

  return (
    <CabinetShell>
      {error && !booking && (
        <Panel className="mx-auto max-w-lg text-center">
          <XCircle className="mx-auto h-12 w-12 text-rn-pink" />
          <p className="mt-4 text-white">{error}</p>
          <Link href="/bookings" className="mt-6 inline-block text-rn-cyan hover:text-white">
            {t("cab.nav.bookings")}
          </Link>
        </Panel>
      )}

      {!booking && !error && (
        <div className="flex min-h-[50vh] items-center justify-center gap-3 text-rn-muted">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("cab.receipt.loading")}
        </div>
      )}

      {booking && view && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl">
          {/* Состояние оплаты */}
          <div className="mb-6 text-center print:hidden">
            {paidAndValid && (
              <>
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]" />
                <h1 className="mt-4 font-display text-3xl font-bold uppercase">{t("cab.receipt.paidTitle")}</h1>
                <p className="mt-2 text-rn-muted">{t("cab.receipt.paidText")}</p>
              </>
            )}
            {view === "awaiting_payment" && (
              <>
                {pollTimedOut ? <Clock className="mx-auto h-14 w-14 text-amber-300" /> : <Loader2 className="mx-auto h-14 w-14 animate-spin text-rn-cyan" />}
                <h1 className="mt-4 font-display text-2xl font-bold uppercase">
                  {pollTimedOut ? t("cab.receipt.notConfirmedTitle") : t("cab.receipt.waitingTitle")}
                </h1>
                <p className="mt-2 text-rn-muted">
                  {pollTimedOut ? t("cab.receipt.notConfirmedText") : t("cab.receipt.waitingText")} {t("cab.receipt.holdLeft")}: {countdown.label}
                </p>
              </>
            )}
            {view === "payment_failed" && (
              <>
                <XCircle className="mx-auto h-14 w-14 text-rn-pink" />
                <h1 className="mt-4 font-display text-2xl font-bold uppercase">{t("cab.receipt.failedTitle")}</h1>
                <p className="mt-2 text-rn-muted">
                  {t("cab.receipt.failedText")} {t("cab.receipt.holdLeft")}: {countdown.label}
                </p>
              </>
            )}
            {(view === "hold_expired" || view === "cancelled") && (
              <>
                <XCircle className="mx-auto h-14 w-14 text-rn-muted" />
                <h1 className="mt-4 font-display text-2xl font-bold uppercase">{t(`cab.receipt.${view}Title`)}</h1>
                <p className="mt-2 text-rn-muted">{t("cab.receipt.bookAgainText")}</p>
              </>
            )}
            {view === "needs_attention" && (
              <>
                <AlertTriangle className="mx-auto h-14 w-14 text-amber-300" />
                <h1 className="mt-4 font-display text-2xl font-bold uppercase">{t("cab.receipt.attentionTitle")}</h1>
                <p className="mt-2 text-rn-muted">{t("cab.receipt.attentionText")}</p>
                <a href={`tel:${club.phone.tel}`} className="mt-3 inline-flex items-center gap-2 font-semibold text-rn-cyan">
                  <Phone className="h-4 w-4" /> {club.phone.display}
                </a>
              </>
            )}
          </div>

          {/* Чек */}
          <Panel className={`relative overflow-hidden ${paidAndValid ? "border-rn-violet/50" : ""}`}>
            {paidAndValid && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rn-violet via-rn-magenta to-rn-cyan" aria-hidden />}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-rn-muted">RONIN · {t("cab.receipt.receipt")}</p>
                <p className="mt-1 text-sm text-rn-muted">№ {booking.bookingNumber}</p>
              </div>
              <StatusChip view={view} />
            </div>

            {paidAndValid && (
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-rn-muted">{t("cab.receipt.code")}</p>
                  <p className="font-display text-5xl font-black tracking-[0.15em] text-white">{booking.bookingCode}</p>
                  <p className="mt-1 text-xs text-rn-muted">{t("cab.receipt.codeHint")}</p>
                </div>
                {qr && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR ${booking.bookingCode}`} className="h-32 w-32 rounded-xl bg-white p-1.5" />
                )}
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-rn-line pt-6 text-sm">
              <Item label={t("cab.book.hall")} value={booking.computer.category.name} />
              <Item label={t("cab.seat.pc")} value={`№ ${booking.computer.number}`} />
              <Item label={t("cab.book.date")} value={formatDate(booking.startAt, language, { weekday: "short" })} />
              <Item label={t("cab.book.time")} value={formatTimeRange(booking.startAt, booking.endAt, language)} />
              <Item label={t("cab.book.tariff")} value={booking.tariff.name} />
              <Item label={t("cab.receipt.amount")} value={formatMoney(booking.price)} />
              {booking.paidAt && <Item label={t("cab.receipt.paidAt")} value={formatDate(booking.paidAt, language, { hour: "2-digit", minute: "2-digit" })} />}
              {booking.paymentMethod && <Item label={t("cab.receipt.method")} value={t(`cab.method.${booking.paymentMethod.replace("offline:", "")}`)} />}
            </dl>
          </Panel>

          <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
            {(view === "awaiting_payment" || view === "payment_failed") && countdown.left > 0 && (
              <button
                onClick={payAgain}
                disabled={paying}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rn-magenta to-rn-violet px-6 py-3 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {paying && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("cab.bookings.pay")}
              </button>
            )}
            {paidAndValid && (
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-2xl border border-rn-line px-6 py-3 text-sm font-semibold text-white hover:border-rn-violet">
                <Printer className="h-4 w-4" /> {t("cab.receipt.print")}
              </button>
            )}
            {(view === "hold_expired" || view === "cancelled") && (
              <Link href="/booking" className="rounded-2xl bg-gradient-to-r from-rn-magenta to-rn-violet px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">
                {t("nav.book")}
              </Link>
            )}
            <Link href="/bookings" className="inline-flex items-center gap-2 rounded-2xl border border-rn-line px-6 py-3 text-sm font-semibold text-white hover:border-rn-violet">
              <CalendarClock className="h-4 w-4" /> {t("cab.nav.bookings")}
            </Link>
          </div>
          {error && booking && <p className="mt-4 text-center text-sm text-rn-pink">{error}</p>}
        </motion.div>
      )}
    </CabinetShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-rn-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  );
}
