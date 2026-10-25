"use client";

/**
 * Компоненты панели управления: тёмный интерфейс, фиолетовые и циановые акценты,
 * читаемые таблицы и различимые статусы. Цвета статусов ПК (зелёный/красный/серый)
 * обозначают операционные состояния и не меняют палитру сайта.
 */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Loader2, Search, X, AlertCircle, Inbox } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import type { BookingDTO, ComputerState } from "@/types/api";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-rn-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-rn-line bg-rn-surface/80 ${className}`}>{children}</div>;
}

export function StatTile({ label, value, hint, accent = "violet" }: { label: string; value: ReactNode; hint?: ReactNode; accent?: "violet" | "cyan" | "pink" | "green" | "red" | "gray" }) {
  const bar = {
    violet: "from-rn-violet to-rn-magenta",
    cyan: "from-rn-cyan to-rn-electric",
    pink: "from-rn-pink to-rn-magenta",
    green: "from-emerald-400 to-emerald-600",
    red: "from-rose-500 to-rn-pink",
    gray: "from-zinc-500 to-zinc-700",
  }[accent];
  return (
    <Card className="relative overflow-hidden p-4">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${bar}`} aria-hidden />
      <div className="text-xs uppercase tracking-wider text-rn-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-rn-muted">{hint}</div>}
    </Card>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "success";

export function Button({
  variant = "secondary",
  loading,
  children,
  className = "",
  ...rest
}: { variant?: ButtonVariant; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-gradient-to-r from-rn-violet to-rn-magenta text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]",
    secondary: "border border-rn-line bg-white/[0.03] text-white hover:border-rn-violet/60",
    danger: "border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
    success: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    ghost: "text-rn-muted hover:text-white",
  };
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rn-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-rn-line bg-rn-night py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-rn-muted/70 focus:border-rn-cyan"
      />
    </label>
  );
}

export function Select({ value, onChange, options, label, className }: { value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }>; label: string; className?: string }) {
  return <Dropdown value={value} onChange={onChange} options={options} label={label} className={className} />;
}

const STATE_STYLE: Record<ComputerState, { label: string; dot: string; chip: string }> = {
  available: { label: "Свободен", dot: "bg-emerald-400", chip: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  occupied: { label: "Занят", dot: "bg-rose-500", chip: "border-rose-500/40 bg-rose-500/10 text-rose-300" },
  maintenance: { label: "Обслуживание", dot: "bg-zinc-500", chip: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300" },
};

export function ComputerStateBadge({ state }: { state: ComputerState }) {
  const s = STATE_STYLE[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.chip}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  );
}

export const computerStateDot = (state: ComputerState) => STATE_STYLE[state].dot;

/** Статус брони для персонала: статус + оплата. */
export function BookingBadges({ booking }: { booking: Pick<BookingDTO, "status" | "paymentStatus" | "holdExpiresAt" | "activeSessionId"> }) {
  const holdExpired = booking.status === "pending" && booking.holdExpiresAt && new Date(booking.holdExpiresAt).getTime() < Date.now();
  const status = {
    pending: holdExpired ? ["Удержание истекло", "border-zinc-500/40 text-zinc-300"] : ["Ждёт оплаты", "border-amber-400/40 text-amber-300"],
    confirmed: ["Подтверждена", "border-rn-cyan/40 text-rn-cyan"],
    completed: ["Завершена", "border-zinc-500/40 text-zinc-300"],
    cancelled: ["Отменена", "border-rose-500/40 text-rose-300"],
    expired: ["Истекла", "border-zinc-500/40 text-zinc-300"],
  }[booking.status];
  const pay = {
    paid: ["Оплачено", "text-emerald-300"],
    pending: ["Не оплачено", "text-rn-muted"],
    failed: ["Оплата не прошла", "text-rose-300"],
    refunded: ["Возврат", "text-amber-300"],
  }[booking.paymentStatus ?? "pending"];
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status[1]}`}>{status[0]}</span>
      <span className={`text-xs font-medium ${pay[1]}`}>{pay[0]}</span>
      {booking.activeSessionId && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">Играет</span>}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/70" onClick={onClose} aria-label="Закрыть" />
      <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-rn-line bg-rn-night p-5 sm:rounded-3xl sm:p-6 ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold uppercase">{title}</h2>
          <button onClick={onClose} className="text-rn-muted hover:text-white" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200" role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-rn-line bg-rn-surface/30 px-6 py-10 text-center text-sm text-rn-muted">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rn-violet/15 text-rn-purple" aria-hidden>
        <Inbox className="h-6 w-6" />
      </span>
      {children}
    </div>
  );
}

/** Карточка показателя с цветной круглой иконкой (стиль обзора). */
export function IconStat({ icon, color, value, label }: { icon: ReactNode; color: string; value: ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-rn-line/70 bg-rn-surface/70 p-4 transition hover:border-rn-violet/50">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ${color}`}>{icon}</span>
      <div className="mt-3 font-display text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-rn-muted">{label}</div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 p-6 text-sm text-rn-muted">
      <Loader2 className="h-4 w-4 animate-spin" /> Загрузка…
    </div>
  );
}

/** Таблица: на телефоне прокручивается по горизонтали. */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-rn-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-rn-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rn-line/70">{children}</tbody>
      </table>
    </div>
  );
}

/** Загрузка данных с повтором. */
export function useLoader<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loader());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, error, loading, reload, setData };
}

const DT = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const T = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
export const fmtDateTime = (iso: string) => DT.format(new Date(iso));
export const fmtTime = (iso: string) => T.format(new Date(iso));
export const fmtMoney = (n: number) => `${new Intl.NumberFormat("ru-RU").format(n)} сом`;

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  finik: "Онлайн · Finik",
  "offline:cash": "В клубе · наличные",
  "offline:card": "В клубе · карта",
  "offline:qr": "В клубе · QR",
};
export const paymentMethodLabel = (value: string) => PAYMENT_METHOD_LABEL[value] ?? value;
