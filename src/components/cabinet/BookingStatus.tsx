"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BookingDTO } from "@/types/api";

/** Сводное состояние брони для интерфейса клиента. */
export type BookingView =
  | "awaiting_payment" // pending, удержание активно
  | "payment_failed" // pending, оплата отклонена, удержание активно
  | "hold_expired" // pending/expired без оплаты
  | "confirmed"
  | "active" // идёт сейчас
  | "completed"
  | "cancelled"
  | "needs_attention"; // оплачено, но бронь не подтверждена (отменена/конфликт)

export function bookingView(b: BookingDTO, now = Date.now()): BookingView {
  const paid = b.paymentStatus === "paid";
  if (paid && (b.status === "cancelled" || b.status === "pending" || b.status === "expired")) return "needs_attention";
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "completed") return "completed";
  if (b.status === "confirmed") {
    const start = new Date(b.startAt).getTime();
    const end = new Date(b.endAt).getTime();
    if (now >= end) return "completed";
    if (now >= start) return "active";
    return "confirmed";
  }
  const holdActive = b.holdExpiresAt ? new Date(b.holdExpiresAt).getTime() > now : false;
  if (b.status === "pending" && holdActive) return b.paymentStatus === "failed" ? "payment_failed" : "awaiting_payment";
  return "hold_expired";
}

const STYLES: Record<BookingView, string> = {
  awaiting_payment: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  payment_failed: "border-rn-pink/40 bg-rn-pink/10 text-rn-pink",
  hold_expired: "border-rn-line bg-white/[0.03] text-rn-muted",
  confirmed: "border-rn-cyan/40 bg-rn-cyan/10 text-rn-cyan",
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  completed: "border-rn-line bg-white/[0.03] text-rn-muted",
  cancelled: "border-rn-line bg-white/[0.03] text-rn-muted",
  needs_attention: "border-amber-400/40 bg-amber-400/10 text-amber-300",
};

export function StatusChip({ view }: { view: BookingView }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${STYLES[view]}`}>
      {t(`cab.status.${view}`)}
    </span>
  );
}

/** Обратный отсчёт до конца удержания неоплаченной брони. */
export function useCountdown(untilIso: string | null) {
  const [left, setLeft] = useState(() => (untilIso ? Math.max(0, new Date(untilIso).getTime() - Date.now()) : 0));
  useEffect(() => {
    if (!untilIso) return;
    const tick = () => setLeft(Math.max(0, new Date(untilIso).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [untilIso]);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { left, label: `${m}:${String(s).padStart(2, "0")}` };
}
