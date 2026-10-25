"use client";

import { useState } from "react";
import { Banknote, CreditCard, QrCode, Play, Square, XCircle, Phone, User } from "lucide-react";
import { adminApi, type OfflineMethod } from "@/lib/admin-api";
import { ApiClientError } from "@/lib/api-client";
import type { BookingDTO } from "@/types/api";
import { BookingBadges, Button, ErrorNote, fmtDateTime, fmtMoney, fmtTime, paymentMethodLabel } from "./ui";

/** Минуты до начала брони, когда можно посадить клиента (совпадает с сервером). */
const EARLY_START_MIN = 15;

/**
 * Карточка брони с действиями персонала. Все проверки повторяются на сервере;
 * здесь кнопки только скрываются, если действие заведомо недоступно.
 */
export function BookingActions({ booking, onChanged }: { booking: BookingDTO; onChanged: (b?: BookingDTO) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const now = Date.now();
  const paid = booking.paymentStatus === "paid";
  const canPay = !paid && (booking.status === "pending" || booking.status === "expired");
  const canStart =
    paid &&
    booking.status === "confirmed" &&
    !booking.activeSessionId &&
    now >= new Date(booking.startAt).getTime() - EARLY_START_MIN * 60_000 &&
    now < new Date(booking.endAt).getTime();
  const canCancel = booking.status === "pending" || (booking.status === "confirmed" && !booking.activeSessionId);

  const run = async (key: string, action: () => Promise<unknown>, success?: string) => {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await action();
      if (success) setNotice(success);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось выполнить действие");
    } finally {
      setBusy(null);
    }
  };

  const pay = (method: OfflineMethod) => run(`pay-${method}`, () => adminApi.recordPayment(booking.id, method), "Оплата принята, бронь подтверждена");

  const cancel = () => {
    const warn = paid ? "\n\nБронь оплачена: возврат денег оформляется отдельно по правилам платёжной системы." : "";
    const reason = window.prompt(`Отменить бронь ${booking.bookingCode}? Укажите причину (необязательно).${warn}`, "");
    if (reason === null) return;
    run("cancel", () => adminApi.cancelBooking(booking.id, reason || undefined), "Бронь отменена");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-3xl font-black tracking-[0.12em]">{booking.bookingCode}</div>
          <div className="text-xs text-rn-muted">№ {booking.bookingNumber}</div>
        </div>
        <BookingBadges booking={booking} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <Item label="Клиент">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-rn-muted" /> {booking.user?.name ?? "—"}
          </span>
          {booking.user?.phone && (
            <a href={`tel:${booking.user.phone}`} className="flex items-center gap-1.5 text-rn-cyan">
              <Phone className="h-3.5 w-3.5" /> {booking.user.phone}
            </a>
          )}
        </Item>
        <Item label="Компьютер">
          № {booking.computer.number} · {booking.computer.category.name}
        </Item>
        <Item label="Время">
          {fmtDateTime(booking.startAt)} – {fmtTime(booking.endAt)}
        </Item>
        <Item label="Тариф / цена">
          {booking.tariff.name} · {fmtMoney(booking.price)}
        </Item>
        {booking.paymentMethod && <Item label="Способ оплаты">{paymentMethodLabel(booking.paymentMethod)}</Item>}
        {booking.paidAt && <Item label="Оплачено">{fmtDateTime(booking.paidAt)}</Item>}
      </dl>

      {error && <ErrorNote>{error}</ErrorNote>}
      {notice && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}

      <div className="space-y-3 border-t border-rn-line pt-4">
        {canPay && (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-rn-muted">Оплата в клубе · {fmtMoney(booking.price)}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="success" loading={busy === "pay-cash"} disabled={!!busy} onClick={() => pay("cash")}>
                <Banknote className="h-4 w-4" /> Наличные
              </Button>
              <Button variant="success" loading={busy === "pay-card"} disabled={!!busy} onClick={() => pay("card")}>
                <CreditCard className="h-4 w-4" /> Карта
              </Button>
              <Button variant="success" loading={busy === "pay-qr"} disabled={!!busy} onClick={() => pay("qr")}>
                <QrCode className="h-4 w-4" /> QR
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {canStart && (
            <Button variant="primary" loading={busy === "start"} disabled={!!busy} onClick={() => run("start", () => adminApi.startSession(booking.id), "Сессия начата")}>
              <Play className="h-4 w-4" /> Начать сессию
            </Button>
          )}
          {booking.activeSessionId && (
            <Button
              variant="primary"
              loading={busy === "end"}
              disabled={!!busy}
              onClick={() => confirm("Завершить игровую сессию?") && run("end", () => adminApi.endSession(booking.activeSessionId!), "Сессия завершена")}
            >
              <Square className="h-4 w-4" /> Завершить сессию
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" loading={busy === "cancel"} disabled={!!busy} onClick={cancel}>
              <XCircle className="h-4 w-4" /> Отменить бронь
            </Button>
          )}
        </div>
        {paid && booking.status === "confirmed" && !canStart && !booking.activeSessionId && (
          <p className="text-xs text-rn-muted">Сессию можно начать за {EARLY_START_MIN} минут до начала брони.</p>
        )}
      </div>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3">
      <dt className="text-[11px] uppercase tracking-wider text-rn-muted">{label}</dt>
      <dd className="mt-1 space-y-0.5 font-medium text-white">{children}</dd>
    </div>
  );
}
