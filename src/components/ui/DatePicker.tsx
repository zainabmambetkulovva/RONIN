"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFloating } from "./useFloating";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTH = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const SHORT = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/** YYYY-MM-DD по локальному времени. */
export function toDayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromDayKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

interface DatePickerProps {
  /** YYYY-MM-DD */
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  /** YYYY-MM-DD — дни раньше недоступны. */
  min?: string;
  className?: string;
}

/** Календарь в стиле сайта (неделя с понедельника, «Сегодня», клавиша Esc). */
export function DatePicker({ value, onChange, label, disabled, min, className = "" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => fromDayKey(value || toDayKey(new Date())));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pos = useFloating(buttonRef, open, 380, 288);
  const today = toDayKey(new Date());

  useEffect(() => {
    if (open) setView(fromDayKey(value || today));
  }, [open, value, today]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t) && !popRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const shift = (first.getDay() + 6) % 7; // понедельник = 0
    const start = new Date(first);
    start.setDate(first.getDate() - shift);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const pick = (d: Date) => {
    onChange(toDayKey(d));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full min-w-[11rem] items-center gap-2 rounded-xl border bg-rn-night px-3 py-2 text-left text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-40 ${
          open ? "border-rn-violet shadow-[0_0_0_3px_rgba(139,92,246,0.2)]" : "border-rn-line hover:border-rn-violet/50"
        }`}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-rn-purple" />
        <span className="truncate">{value ? SHORT.format(fromDayKey(value)) : "Выберите дату"}</span>
      </button>

      {open &&
        pos &&
        createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-label={label}
          style={{ position: "fixed", left: pos.left, ...(pos.up ? { bottom: window.innerHeight - pos.top } : { top: pos.top }) }}
          className="z-[1000] w-72 rounded-2xl border border-rn-line bg-rn-surface p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-rn-muted hover:bg-white/[0.06] hover:text-white" aria-label="Предыдущий месяц">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold capitalize text-white">{MONTH.format(view)}</span>
            <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-rn-muted hover:bg-white/[0.06] hover:text-white" aria-label="Следующий месяц">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-rn-muted">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">
                {w}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((d) => {
              const key = toDayKey(d);
              const inMonth = d.getMonth() === view.getMonth();
              const isSel = key === value;
              const isToday = key === today;
              const blocked = !!min && key < min;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={blocked}
                  onClick={() => pick(d)}
                  aria-pressed={isSel}
                  className={`h-9 rounded-lg text-sm transition disabled:cursor-not-allowed disabled:opacity-25 ${
                    isSel
                      ? "bg-gradient-to-br from-rn-violet to-rn-magenta font-semibold text-white shadow-[0_6px_20px_-8px_rgba(217,70,239,0.8)]"
                      : isToday
                        ? "text-rn-cyan ring-1 ring-rn-cyan/50 hover:bg-white/[0.06]"
                        : inMonth
                          ? "text-white/90 hover:bg-white/[0.06]"
                          : "text-white/25 hover:bg-white/[0.04]"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between border-t border-rn-line/60 pt-3 text-xs">
            <button type="button" onClick={() => setOpen(false)} className="text-rn-muted hover:text-white">
              Закрыть
            </button>
            <button type="button" disabled={!!min && today < min} onClick={() => pick(new Date())} className="font-semibold text-rn-cyan hover:text-white disabled:opacity-30">
              Сегодня
            </button>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
