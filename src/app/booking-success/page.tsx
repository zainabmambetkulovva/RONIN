"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, AlertTriangle, XCircle, Download, Share2, CalendarClock, Phone } from "lucide-react";
import { UserAvatar } from "@/components/cabinet/UserAvatar";
import { useSession } from "@/hooks/useSession";
import type { AvatarDTO } from "@/types/api";
import { CabinetShell, Panel } from "@/components/cabinet/CabinetShell";
import { StatusChip, bookingView, useCountdown } from "@/components/cabinet/BookingStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, ApiClientError } from "@/lib/api-client";
import { formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import { club } from "@/config/club";
import type { BookingDTO } from "@/types/api";
import { translateTariffName } from "@/lib/tariff-name";

/** Сколько ждать подтверждения оплаты от Finik, прежде чем показать «пока не подтверждено». */
const POLL_MS = 3000;
const POLL_LIMIT_MS = 3 * 60_000;

export default function BookingSuccessPage() {
  const { t, language } = useLanguage();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | string | null>(null);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [avatars, setAvatars] = useState<AvatarDTO[]>([]);
  const [busyFile, setBusyFile] = useState<"pdf" | "share" | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [paying, setPaying] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    // Платёжная система может дописать свои параметры к адресу возврата — берём только сам id
    const raw = new URLSearchParams(window.location.search).get("bookingId");
    const id = raw?.split(/[?&#/\s]/)[0]?.trim();
    if (id) {
      setBookingId(id);
      return;
    }
    // Платёжная система вернула без номера брони — показываем последнюю бронь клиента за последний час
    api
      .myBookings()
      .then(({ bookings }) => {
        const recent = bookings
          .filter((b) => Date.now() - new Date(b.createdAt).getTime() < 60 * 60_000)
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
        if (recent) setBookingId(recent.id);
        else setError(t("cab.receipt.notFound"));
      })
      .catch(() => setError(t("cab.receipt.notFound")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    if (!bookingId) return null;
    // Временные сбои (холодный старт, сеть) не должны сразу показывать ошибку: до 4 попыток
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await api.booking(bookingId);
        if (!res?.booking) throw new Error("empty_response");
        setBooking(res.booking);
        setError(null);
        return res.booking;
      } catch (e) {
        const status = e instanceof ApiClientError ? e.status : null;
        // Запасной путь: та же бронь из списка «Мои брони»
        if (status !== 401 && status !== 404) {
          try {
            const { bookings } = await api.myBookings();
            const own = bookings.find((b) => b.id === bookingId);
            if (own) {
              setBooking(own);
              setError(null);
              return own;
            }
          } catch {
            /* пробуем ещё раз ниже */
          }
        }
        if (status === 401) {
          // Сессия потерялась по дороге с платёжной страницы — войти и вернуться к чеку
          window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
          return null;
        }
        if (status === 404 || attempt === 3) {
          setErrorCode(status ?? (e instanceof Error ? e.message.slice(0, 60) : "unknown"));
          setError(status === 404 ? t("cab.receipt.notFound") : t("cab.receipt.loadError"));
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    return null;
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

  // Персонаж, которого выбрал пользователь, — на чеке вместо QR-кода
  useEffect(() => {
    if (paidAndValid) api.avatars().then((r) => setAvatars(r.avatars)).catch(() => setAvatars([]));
  }, [paidAndValid]);

  /** Чек в PDF: снимок карточки чека (кириллица и оформление сохраняются как на экране). */
  const makePdf = async (): Promise<Blob | null> => {
    const node = receiptRef.current;
    if (!node || !booking) return null;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    const canvas = await html2canvas(node, {
      backgroundColor: "#0b0818",
      scale: 2,
      useCORS: true,
      // html2canvas рисует текст во flex-«таблетках» ниже, чем браузер, — выравниваем в копии для PDF
      onclone: (doc) => {
        doc.querySelectorAll<HTMLElement>("[data-receipt] span.rounded-full").forEach((el) => {
          el.style.display = "inline-block";
          el.style.lineHeight = "1";
          el.style.paddingTop = "4px";
          el.style.paddingBottom = "8px";
        });
        doc.querySelectorAll<HTMLElement>("[data-receipt] .font-display").forEach((el) => {
          el.style.lineHeight = "1.15";
        });
      },
    });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    const pageW = pdf.internal.pageSize.getWidth();
    const margin = 8;
    const w = pageW - margin * 2;
    const h = (canvas.height / canvas.width) * w;
    pdf.setFillColor(11, 8, 24);
    pdf.rect(0, 0, pageW, pdf.internal.pageSize.getHeight(), "F");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, w, h);
    return pdf.output("blob");
  };

  const fileName = booking ? `RONIN-${booking.bookingCode}.pdf` : "RONIN.pdf";

  const downloadPdf = async () => {
    setBusyFile("pdf");
    setShareNote(null);
    try {
      const blob = await makePdf();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      setShareNote(t("cab.receipt.fileError"));
    } finally {
      setBusyFile(null);
    }
  };

  const share = async () => {
    if (!booking) return;
    setBusyFile("share");
    setShareNote(null);
    const text = `${t("cab.receipt.receipt")} RONIN · ${t("cab.receipt.code")}: ${booking.bookingCode} · ${t("cab.seat.pc")} № ${booking.computer.number} · ${formatDate(booking.startAt, language, { weekday: "short" })} ${formatTimeRange(booking.startAt, booking.endAt, language)}`;
    try {
      const blob = await makePdf().catch(() => null);
      const file = blob ? new File([blob], fileName, { type: "application/pdf" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "RONIN", text });
      } else if (navigator.share) {
        await navigator.share({ title: "RONIN", text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        setShareNote(t("cab.receipt.copied"));
      }
    } catch (e) {
      // Пользователь закрыл окно «Поделиться» — это не ошибка
      if (!(e instanceof DOMException && e.name === "AbortError")) setShareNote(t("cab.receipt.fileError"));
    } finally {
      setBusyFile(null);
    }
  };

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
          {errorCode && errorCode !== 404 && <p className="mt-1 text-xs text-rn-muted">Код ошибки: {errorCode}</p>}
          <div className="mt-6 flex justify-center gap-5">
            {bookingId && errorCode !== 404 && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  load();
                }}
                className="text-rn-cyan hover:text-white"
              >
                {t("cab.receipt.retry")}
              </button>
            )}
            <Link href="/bookings" className="text-rn-cyan hover:text-white">
              {t("cab.nav.bookings")}
            </Link>
          </div>
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
          <div ref={receiptRef} data-receipt>
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
                  <p className="mt-2 text-xs text-rn-muted">{t("cab.receipt.codeHint")}</p>
                </div>
                {session && (
                  <UserAvatar name={session.user.name ?? ""} avatarCode={session.user.avatar} image={session.user.image} avatars={avatars} size={120} />
                )}
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-rn-line pt-6 text-sm">
              <Item label={t("cab.book.hall")} value={booking.computer.category.name} />
              <Item label={t("cab.seat.pc")} value={`№ ${booking.computer.number}`} />
              <Item label={t("cab.book.date")} value={formatDate(booking.startAt, language, { weekday: "short" })} />
              <Item label={t("cab.book.time")} value={formatTimeRange(booking.startAt, booking.endAt, language)} />
              <Item label={t("cab.book.tariff")} value={translateTariffName(booking.tariff.name, language)} />
              <Item label={t("cab.receipt.amount")} value={formatMoney(booking.price)} />
              {booking.paidAt && <Item label={t("cab.receipt.paidAt")} value={formatDate(booking.paidAt, language, { hour: "2-digit", minute: "2-digit" })} />}
              {booking.paymentMethod && <Item label={t("cab.receipt.method")} value={t(`cab.method.${booking.paymentMethod.replace("offline:", "")}`)} />}
            </dl>
          </Panel>
          </div>

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
              <>
                <button onClick={downloadPdf} disabled={!!busyFile} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rn-violet to-rn-magenta px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
                  {busyFile === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {t("cab.receipt.download")}
                </button>
                <button onClick={share} disabled={!!busyFile} className="inline-flex items-center gap-2 rounded-2xl border border-rn-line px-6 py-3 text-sm font-semibold text-white hover:border-rn-violet disabled:opacity-60">
                  {busyFile === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />} {t("cab.receipt.share")}
                </button>
              </>
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
          {shareNote && <p className="mt-3 text-center text-sm text-rn-muted">{shareNote}</p>}
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
