"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Box, CalendarClock, Clock, Loader2, Monitor, RefreshCw, User, X } from "lucide-react";
import { useClubLayout } from "./useClubLayout";
import type { ClubLayout } from "@/config/club-layout";
import { DatePicker, toDayKey } from "@/components/ui/DatePicker";
import { Dropdown } from "@/components/ui/Dropdown";
import type { ComputerScheduleDTO } from "@/types/api";
import type { SeatState, SeatView } from "./ClubMap3D";
import { useLanguage } from "@/contexts/LanguageContext";

const ClubMap3D = dynamic(() => import("./ClubMap3D"), {
  ssr: false,
  loading: () => <Loading3D />,
});

function Loading3D() {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-rn-muted">
      <Loader2 className="h-5 w-5 animate-spin" /> {t("map.loading3d")}
    </div>
  );
}

const LOCALES = { ru: "ru-RU", en: "en-GB", ky: "ky-KG" } as const;
const TIME = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
const fmt = (d: Date) => TIME.format(d);

const HOURS = Array.from({ length: 24 }, (_, h) => ({ value: String(h), label: `${String(h).padStart(2, "0")}:00` }));

interface Interval {
  start: Date;
  end: Date;
  kind: "booking" | "hold" | "session";
  clientName?: string | null;
  bookingCode?: string;
}

interface SeatInfo {
  computer: ComputerScheduleDTO | null;
  state: SeatState;
  /** Занят до / свободен до (в выбранный момент). */
  until: Date | null;
  current: Interval | null;
  intervals: Interval[];
}

/** Состояние ПК в момент t по интервалам занятости. */
function seatInfo(computer: ComputerScheduleDTO | null, t: Date, isNow: boolean): SeatInfo {
  if (!computer) return { computer, state: "unknown", until: null, current: null, intervals: [] };
  const intervals: Interval[] = computer.busy
    .map((b) => ({ ...b, start: new Date(b.start), end: new Date(b.end) }))
    .sort((a, b) => +a.start - +b.start);
  if (computer.maintenance) return { computer, state: "maintenance", until: null, current: null, intervals };
  const current = intervals.find((i) => i.start <= t && i.end > t) ?? (isNow && computer.inSessionNow ? intervals.find((i) => i.kind === "session") ?? null : null);
  if (current) {
    // Подряд идущие брони — один непрерывный интервал «занят до»
    let until = current.end;
    for (const i of intervals) if (i.start <= until && i.end > until) until = i.end;
    return { computer, state: "busy", until, current, intervals };
  }
  const next = intervals.find((i) => i.start > t);
  return { computer, state: "free", until: next?.start ?? null, current: null, intervals };
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

interface ClubMapProps {
  /** staff — показывать имя клиента и код брони, без кнопки «Забронировать». */
  mode?: "public" | "staff";
  /** Для персонала: что делать по нажатию на бронь в панели. */
  onOpenBooking?: (bookingCode: string) => void;
  className?: string;
  /** Компактно: сцена ниже, панель ПК — поверх сцены (для главной и админки). */
  compact?: boolean;
}

/** 3D-карта клуба: цвет ПК — занят/свободен в выбранный момент, панель — расписание выбранного ПК на день. */
export function ClubMap({ mode = "public", onOpenBooking, className = "", compact = false }: ClubMapProps) {
  const { t, language } = useLanguage();
  const DAY = useMemo(() => new Intl.DateTimeFormat(LOCALES[language] ?? "ru-RU", { day: "numeric", month: "long" }), [language]);
  const [isNow, setIsNow] = useState(true);
  const [day, setDay] = useState(toDayKey(new Date()));
  const [hour, setHour] = useState(String(new Date().getHours()));
  const [now, setNow] = useState(() => new Date());
  const [data, setData] = useState<ComputerScheduleDTO[] | null>(null);
  // Схема — по компьютерам из базы: на карте ровно те ПК и залы, что в админке
  const CLUB_LAYOUT = useClubLayout(data);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  // 3D грузим, только когда карта появилась на экране
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const moment = useMemo(() => {
    if (isNow) return now;
    const [y, m, d] = day.split("-").map(Number);
    return new Date(y, m - 1, d, Number(hour), 0, 0);
  }, [isNow, now, day, hour]);

  const dayStart = useMemo(() => {
    const d = new Date(moment);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [moment]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/computers/schedule?from=${encodeURIComponent(dayStart.toISOString())}&hours=30`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { computers: ComputerScheduleDTO[] };
      setData(json.computers);
    } catch {
      setError("loadError");
    }
  }, [dayStart]);

  useEffect(() => {
    if (inView) load();
  }, [inView, load]);

  // «Сейчас» — живое: раз в минуту обновляем время и данные
  useEffect(() => {
    if (!isNow || !inView) return;
    const id = setInterval(() => {
      setNow(new Date());
      load();
    }, 60_000);
    return () => clearInterval(id);
  }, [isNow, inView, load]);

  const byNumber = useMemo(() => new Map((data ?? []).map((c) => [c.number, c])), [data]);
  const infos = useMemo(() => {
    const map = new Map<number, SeatInfo>();
    for (const s of CLUB_LAYOUT.slots) map.set(s.number, seatInfo(byNumber.get(s.number) ?? null, moment, isNow));
    return map;
  }, [byNumber, moment, isNow, CLUB_LAYOUT]);
  const seats: SeatView[] = useMemo(() => CLUB_LAYOUT.slots.map((s) => ({ number: s.number, state: infos.get(s.number)?.state ?? "unknown" })), [infos, CLUB_LAYOUT]);
  const counts = useMemo(() => {
    const c = { free: 0, busy: 0, maintenance: 0 };
    for (const s of seats) if (s.state !== "unknown") c[s.state]++;
    return c;
  }, [seats]);

  const info = selected !== null ? infos.get(selected) ?? null : null;

  return (
    <div className={`overflow-hidden rounded-3xl border border-rn-line bg-rn-surface/60 ${className}`}>
      {/* Панель управления */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rn-line/70 p-3 sm:p-4">
        <div className="flex rounded-xl border border-rn-line p-0.5" role="tablist" aria-label={t("map.pickTime")}>
          <button role="tab" aria-selected={isNow} onClick={() => { setIsNow(true); setNow(new Date()); }} className={`rounded-lg px-3 py-1.5 text-sm ${isNow ? "bg-rn-violet/30 text-white" : "text-rn-muted hover:text-white"}`}>
            {t("map.now")}
          </button>
          <button role="tab" aria-selected={!isNow} onClick={() => setIsNow(false)} className={`rounded-lg px-3 py-1.5 text-sm ${!isNow ? "bg-rn-violet/30 text-white" : "text-rn-muted hover:text-white"}`}>
            {t("map.pickTime")}
          </button>
        </div>
        {!isNow && (
          <>
            <DatePicker label={t("map.day")} value={day} onChange={setDay} min={toDayKey(new Date())} />
            <Dropdown label={t("map.hour")} value={hour} onChange={setHour} options={HOURS} className="w-28" />
          </>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs">
          <Legend color="bg-emerald-500" label={`${t("map.free")} · ${counts.free}`} />
          <Legend color="bg-rose-500" label={`${t("map.busy")} · ${counts.busy}`} />
          {counts.maintenance > 0 && <Legend color="bg-zinc-500" label={`${t("map.service")} · ${counts.maintenance}`} />}
          <button onClick={load} className="rounded-lg border border-rn-line p-1.5 text-rn-muted hover:text-white" aria-label={t("map.refresh")}>
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={compact ? "relative" : "grid lg:grid-cols-[minmax(0,1fr)_320px]"}>
        {/* Сцена */}
        <div
          ref={hostRef}
          className={`relative bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)] ${
            compact ? "h-[60vh] max-h-[460px] min-h-[340px]" : "h-[72vh] max-h-[640px] min-h-[380px] lg:h-[560px]"
          }`}
        >
          {error && <p className="absolute left-4 top-4 z-10 rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{t("map.loadError")}</p>}
          {inView && webgl === true && (data || error) && <ClubMap3D layout={CLUB_LAYOUT} seats={seats} selected={selected} onSelect={setSelected} />}
          {inView && webgl === false && (data || error) && <FlatMap layout={CLUB_LAYOUT} seats={seats} selected={selected} onSelect={setSelected} />}
          <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
            {isNow ? `${t("map.now")}, ${fmt(moment)}` : `${DAY.format(moment)}, ${fmt(moment)}`} · {t("map.rotate")}
          </p>
        </div>

        {/* Выбранный ПК */}
        {compact ? (
          <AnimatePresence>
            {info && (
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-3 bottom-3 z-10 max-h-[80%] overflow-y-auto rounded-2xl border border-rn-line bg-rn-surface/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:w-80"
              >
                <SeatPanel number={selected!} info={info} moment={moment} dayStart={dayStart} mode={mode} onClose={() => setSelected(null)} onOpenBooking={onOpenBooking} />
              </motion.aside>
            )}
          </AnimatePresence>
        ) : (
        <aside className="border-t border-rn-line/70 p-4 lg:border-l lg:border-t-0">
          {!info ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center text-sm text-rn-muted">
              <Box className="h-10 w-10 text-rn-purple" />
              {t("map.tapPc")}
            </div>
          ) : (
            <SeatPanel number={selected!} info={info} moment={moment} dayStart={dayStart} mode={mode} onClose={() => setSelected(null)} onOpenBooking={onOpenBooking} />
          )}
        </aside>
        )}
      </div>
    </div>
  );
}

function SeatPanel({
  number,
  info,
  moment,
  dayStart,
  mode,
  onClose,
  onOpenBooking,
}: {
  number: number;
  info: SeatInfo;
  moment: Date;
  dayStart: Date;
  mode: "public" | "staff";
  onClose: () => void;
  onOpenBooking?: (code: string) => void;
}) {
  const { t } = useLanguage();
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600_000);
  const today = info.intervals.filter((i) => i.end > dayStart && i.start < dayEnd);
  const status =
    info.state === "busy"
      ? { text: info.until ? t("map.busyUntil").replace("{time}", fmt(info.until)) : t("map.busy"), cls: "text-rose-300", dot: "bg-rose-500" }
      : info.state === "free"
        ? { text: info.until ? t("map.freeUntil").replace("{time}", fmt(info.until)) : t("map.freeAllDay"), cls: "text-emerald-300", dot: "bg-emerald-500" }
        : info.state === "maintenance"
          ? { text: t("map.maintenance"), cls: "text-zinc-300", dot: "bg-zinc-500" }
          : { text: t("map.notInSystem"), cls: "text-rn-muted", dot: "bg-zinc-700" };

  const bookHref =
    info.computer && info.state === "free"
      ? `/booking?categoryId=${encodeURIComponent(info.computer.category.id)}&computerId=${encodeURIComponent(info.computer.id)}&start=${encodeURIComponent(moment.toISOString())}`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <Monitor className="h-5 w-5 text-rn-purple" /> ПК № {number}
          </p>
          {info.computer && <p className="text-sm text-rn-muted">{info.computer.category.name}</p>}
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-rn-muted hover:text-white" aria-label={t("map.close")}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className={`flex items-center gap-2 font-semibold ${status.cls}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} /> {status.text}
      </p>

      {/* Шкала дня: красное — занято, зелёное — свободно */}
      {info.computer && (
        <div>
          <div className="relative h-3 overflow-hidden rounded-full bg-emerald-500/30" aria-hidden>
            {today.map((i, k) => {
              const left = Math.max(0, (+i.start - +dayStart) / 864e5) * 100;
              const right = Math.min(1, (+i.end - +dayStart) / 864e5) * 100;
              return <span key={k} className="absolute inset-y-0 bg-rose-500/80" style={{ left: `${left}%`, width: `${Math.max(0.8, right - left)}%` }} />;
            })}
            <span className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${Math.min(100, Math.max(0, ((+moment - +dayStart) / 864e5) * 100))}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-rn-muted">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>
      )}

      {/* Список броней — только если они есть (иначе статус выше уже говорит «свободен весь день») */}
      {today.length > 0 && (
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rn-muted">
          <CalendarClock className="h-3.5 w-3.5" /> {t("map.busyThatDay")}
        </p>
          <ul className="space-y-1.5">
            {today.map((i, k) => (
              <li key={k} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-white">
                  <Clock className="h-3.5 w-3.5 text-rose-300" />
                  {fmt(i.start)}–{fmt(i.end)}
                </span>
                <span className="text-xs text-rn-muted">{i.kind === "session" ? t("map.kindSession") : i.kind === "hold" ? t("map.kindHold") : t("map.kindBooking")}</span>
                {mode === "staff" && (i.clientName || i.bookingCode) && (
                  <button
                    type="button"
                    onClick={() => i.bookingCode && onOpenBooking?.(i.bookingCode)}
                    className="flex items-center gap-1 text-xs text-rn-cyan hover:text-white"
                  >
                    <User className="h-3 w-3" /> {i.clientName ?? i.bookingCode}
                  </button>
                )}
              </li>
            ))}
          </ul>
      </div>
      )}

      {info.computer && info.computer.specs.length > 0 && <p className="text-xs text-rn-muted">{info.computer.specs.join(" · ")}</p>}

      {mode === "public" && bookHref && (
        <Link href={bookHref} className="rn-brand-gradient block rounded-2xl py-3 text-center font-display text-sm font-bold uppercase tracking-widest text-white">
          {t("map.book").replace("{n}", String(number))}
        </Link>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-rn-muted">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

/** Плоская схема для устройств без WebGL — те же цвета и выбор. */
function FlatMap({ layout: CLUB_LAYOUT, seats, selected, onSelect }: { layout: ClubLayout; seats: SeatView[]; selected: number | null; onSelect: (n: number) => void }) {
  const state = new Map(seats.map((s) => [s.number, s.state]));
  const W = CLUB_LAYOUT.width;
  const D = CLUB_LAYOUT.depth;
  const tone: Record<SeatState, string> = { free: "bg-emerald-500", busy: "bg-rose-500", maintenance: "bg-zinc-500", unknown: "bg-zinc-700" };
  return (
    <div className="absolute inset-0 overflow-auto p-4">
      <div className="relative mx-auto" style={{ width: "100%", maxWidth: 900, aspectRatio: `${W} / ${D}` }}>
        {CLUB_LAYOUT.slots.map((s) => (
          <button
            key={s.number}
            onClick={() => onSelect(s.number)}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded text-[9px] font-bold text-white ${tone[state.get(s.number) ?? "unknown"]} ${selected === s.number ? "ring-2 ring-white" : ""}`}
            style={{ left: `${(s.x / W) * 100}%`, top: `${(s.z / D) * 100}%`, width: `${(1 / W) * 100}%`, aspectRatio: "1.4 / 1" }}
            aria-label={`ПК ${s.number}`}
          >
            {s.number}
          </button>
        ))}
      </div>
    </div>
  );
}
