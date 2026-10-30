"use client";

import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, Monitor, AlertCircle, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { CabinetShell, PageTitle, Panel } from "@/components/cabinet/CabinetShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/hooks/useSession";
import { api, ApiClientError } from "@/lib/api-client";
import { combineDayTime, dayKey, formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import { formatDuration } from "@/components/landing/useClubData";
import { durationInName, translateTariffName } from "@/lib/tariff-name";
import { BOOKING_HOLD_MINUTES } from "@/server/config";
import { Dropdown } from "@/components/ui/Dropdown";
import { SeatPicker3D } from "@/components/map/SeatPicker3D";
import type { CategoryDTO, ComputerDTO, TariffDTO } from "@/types/api";

const DAYS_AHEAD = 14;

function timeSlots() {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) for (const m of [0, 30]) slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  return slots;
}

/** Ближайший получасовой слот не раньше чем через 10 минут. */
function nextSlot() {
  const d = new Date(Date.now() + 10 * 60_000);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  d.setMinutes(m === 0 ? 0 : m <= 30 ? 30 : 60);
  return d;
}

export default function BookingPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { status: sessionStatus } = useSession();

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [tariffs, setTariffs] = useState<TariffDTO[]>([]);
  const [loadError, setLoadError] = useState(false);

  const initialSlot = useMemo(nextSlot, []);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tariffId, setTariffId] = useState<string | null>(null);
  const [day, setDay] = useState(dayKey(initialSlot));
  const [time, setTime] = useState(
    `${String(initialSlot.getHours()).padStart(2, "0")}:${String(initialSlot.getMinutes()).padStart(2, "0")}`
  );
  const [computers, setComputers] = useState<ComputerDTO[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Все ПК клуба — только для схемы 3D (другие залы показаны тёмными)
  const [clubComputers, setClubComputers] = useState<ComputerDTO[] | null>(null);
  useEffect(() => {
    api.computers().then((r) => setClubComputers(r.computers)).catch(() => setClubComputers(null));
  }, []);
  const [computerId, setComputerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Возврат с оплаты Finik: ведём на страницу чека, где статус проверяется на сервере
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");
    if (params.get("payment") === "success" && bookingId) {
      router.replace(`/booking-success?bookingId=${encodeURIComponent(bookingId)}`);
      return;
    }
    const preset = params.get("categoryId");
    if (preset) setCategoryId(preset);
    // Переход с 3D-карты: сразу этот ПК и это время (округляем вверх до слота 30 минут)
    const presetComputer = params.get("computerId");
    if (presetComputer) setComputerId(presetComputer);
    const presetStart = params.get("start");
    const startDate = presetStart ? new Date(presetStart) : null;
    if (startDate && !Number.isNaN(+startDate) && startDate.getTime() > Date.now() - 60_000) {
      const slot = new Date(Math.ceil(startDate.getTime() / 1_800_000) * 1_800_000);
      setDay(dayKey(slot));
      setTime(`${String(slot.getHours()).padStart(2, "0")}:${String(slot.getMinutes()).padStart(2, "0")}`);
    }
  }, [router]);

  useEffect(() => {
    Promise.all([api.categories(), api.tariffs()])
      .then(([c, tr]) => {
        setCategories(c.categories);
        setTariffs(tr.tariffs);
      })
      .catch(() => setLoadError(true));
  }, []);

  // Залы, для которых есть тарифы и компьютеры
  const halls = useMemo(
    () =>
      categories
        .filter((c) => c._count.computers > 0 && tariffs.some((tr) => tr.categoryId === c.id || tr.categoryId === null))
        .sort((a, b) => minPrice(tariffs, a.id) - minPrice(tariffs, b.id)),
    [categories, tariffs]
  );

  useEffect(() => {
    if (halls.length && !halls.some((h) => h.id === categoryId)) setCategoryId(halls[0].id);
  }, [halls, categoryId]);

  const hallTariffs = useMemo(
    () => tariffs.filter((tr) => tr.categoryId === categoryId || tr.categoryId === null).sort((a, b) => a.price - b.price),
    [tariffs, categoryId]
  );

  useEffect(() => {
    if (hallTariffs.length && !hallTariffs.some((tr) => tr.id === tariffId)) setTariffId(hallTariffs[0].id);
  }, [hallTariffs, tariffId]);

  const tariff = hallTariffs.find((tr) => tr.id === tariffId) ?? null;
  const hall = halls.find((h) => h.id === categoryId) ?? null;
  const start = combineDayTime(day, time);
  const end = tariff ? new Date(start.getTime() + tariff.durationMinutes * 60_000) : null;
  const startInPast = start.getTime() < Date.now() - 60_000;
  const startIso = start.toISOString();

  // Доступность компьютеров на выбранный интервал
  // Прежний список не сбрасываем: иначе 3D-сцена удаляется и строится заново (на телефоне — 1–3 с при смене зала)
  const requestRef = useRef(0);
  const loadComputers = useCallback(async () => {
    // Пока у нового зала выбирается тариф (миг между рендерами) — просто ждём, список не сбрасываем
    if (!categoryId || !tariff) return;
    if (startInPast) {
      setComputers(null);
      return;
    }
    const id = ++requestRef.current;
    setRefreshing(true);
    try {
      const res = await api.computers({ categoryId, start: startIso, durationMinutes: tariff.durationMinutes });
      if (id === requestRef.current) setComputers(res.computers);
    } catch {
      if (id === requestRef.current) {
        setComputers([]);
        setError(t("cab.book.errorLoad"));
      }
    } finally {
      if (id === requestRef.current) setRefreshing(false);
    }
    // t не в зависимостях: функция перевода пересоздаётся при каждом рендере и вызвала бы повторные запросы
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, tariff, startIso, startInPast]);

  useEffect(() => {
    loadComputers();
  }, [loadComputers]);

  // Выбранный ПК больше не свободен в новом интервале — сбрасываем выбор
  useEffect(() => {
    if (computerId && computers && !computers.some((c) => c.id === computerId && c.availableForSlot)) setComputerId(null);
  }, [computers, computerId]);

  const computer = computers?.find((c) => c.id === computerId) ?? null;
  const freeCount = computers?.filter((c) => c.availableForSlot).length ?? 0;

  const days = useMemo(() => {
    const list: Date[] = [];
    const base = new Date();
    for (let i = 0; i < DAYS_AHEAD; i++) list.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
    return list;
  }, []);

  const submit = async () => {
    if (!tariff || !computer) return;
    setError(null);

    if (sessionStatus !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/booking?categoryId=${categoryId ?? ""}`)}`);
      return;
    }

    setSubmitting(true);
    let bookingId: string | null = null;
    try {
      const { booking } = await api.createBooking({ computerId: computer.id, tariffId: tariff.id, startAt: startIso });
      bookingId = booking.id;
      const { paymentUrl } = await api.payBooking(booking.id);
      window.location.href = paymentUrl;
    } catch (e) {
      const err = e instanceof ApiClientError ? e : null;
      if (err?.code === "computer_busy") {
        setError(t("cab.book.errorBusy"));
        loadComputers();
      } else if (bookingId) {
        // Бронь создана, но ссылку на оплату получить не удалось — её можно оплатить из «Моих броней»
        router.push("/bookings?payError=1");
      } else {
        setError(err?.message || t("cab.book.errorGeneric"));
      }
      setSubmitting(false);
    }
  };

  return (
    <CabinetShell wide>
      <PageTitle eyebrow={t("cab.book.eyebrow")} title={t("cab.book.title")} subtitle={t("cab.book.subtitle")} />

      {loadError && (
        <Panel className="mb-6 flex items-center gap-3 border-rn-pink/40 text-rn-pink">
          <AlertCircle className="h-5 w-5" /> {t("cab.book.errorLoad")}
        </Panel>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          {/* Шаг 1: зал и тариф */}
          <Panel>
            <StepTitle n={1} title={t("cab.book.step1")} />
            <div className="rn-no-scrollbar -mx-2 mb-4 flex gap-2 overflow-x-auto px-2 py-2">
              {halls.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setCategoryId(h.id)}
                  aria-pressed={h.id === categoryId}
                  className={`shrink-0 rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest transition ${
                    h.id === categoryId
                      ? "bg-gradient-to-r from-rn-violet to-rn-magenta text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                      : "border border-rn-line text-rn-muted hover:text-white"
                  }`}
                >
                  {h.name}
                </button>
              ))}
              {!halls.length && !loadError && <div className="h-10 w-full animate-pulse rounded-full bg-white/5" />}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {hallTariffs.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => setTariffId(tr.id)}
                  aria-pressed={tr.id === tariffId}
                  className={`rounded-2xl border p-4 text-left transition ${
                    tr.id === tariffId ? "border-rn-magenta bg-rn-magenta/10 shadow-[0_0_24px_rgba(217,70,239,0.25)]" : "border-rn-line hover:border-rn-violet/60"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{translateTariffName(tr.name, language)}</div>
                  {!durationInName(tr.name, tr.durationMinutes) && <div className="mt-1 text-xs text-rn-muted">{formatDuration(tr.durationMinutes, t)}</div>}
                  <div className="mt-3 font-display text-lg font-bold text-white">{formatMoney(tr.price)}</div>
                </button>
              ))}
            </div>
          </Panel>

          {/* Шаг 2: дата и время */}
          <Panel>
            <StepTitle n={2} title={t("cab.book.step2")} />
            <div className="rn-no-scrollbar -mx-2 mb-4 flex gap-2 overflow-x-auto px-2 py-2">
              {days.map((d, i) => {
                const key = dayKey(d);
                const active = key === day;
                return (
                  <button
                    key={key}
                    onClick={() => setDay(key)}
                    aria-pressed={active}
                    className={`flex w-[72px] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition ${
                      active ? "border-rn-cyan bg-rn-cyan/10 text-white" : "border-rn-line text-rn-muted hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider">
                      {i === 0 ? t("cab.book.today") : i === 1 ? t("cab.book.tomorrow") : formatDate(d, language, { weekday: "short", day: undefined, month: undefined })}
                    </span>
                    <span className="font-display text-xl font-bold">{d.getDate()}</span>
                    <span className="text-[10px]">{formatDate(d, language, { day: undefined, month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            <p className="mb-2 flex items-center gap-2 text-sm text-rn-muted">
              <Clock className="h-4 w-4" /> {t("cab.book.startTime")}
            </p>
            <Dropdown
              label={t("cab.book.startTime")}
              className="w-full sm:w-60"
              value={time}
              onChange={setTime}
              options={timeSlots().map((slot) => ({ value: slot, label: slot, disabled: combineDayTime(day, slot).getTime() < Date.now() - 60_000 }))}
            />
            {startInPast && <p className="mt-2 text-sm text-rn-pink">{t("cab.book.pastTime")}</p>}
          </Panel>

          {/* Шаг 3: компьютер */}
          <Panel>
            <StepTitle n={3} title={t("cab.book.step3")} />
            {computers === null && !startInPast && (
              <div className="flex items-center gap-2 text-rn-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> {t("cab.book.checking")}
              </div>
            )}
            {computers && computers.length > 0 && (
              <>
                <p className="mb-4 flex items-center gap-2 text-sm text-rn-muted">
                  {t("cab.book.freeInSlot")}: <span className="font-semibold text-white">{freeCount}</span> / {computers.length}
                  {refreshing && <Loader2 className="h-4 w-4 animate-spin" aria-label={t("cab.book.checking")} />}
                </p>
                <SeatPicker3D computers={computers} layoutComputers={clubComputers} selectedId={computerId} onSelect={(c) => setComputerId(c.id)} />
              </>
            )}
            {computers && computers.length > 0 && freeCount === 0 && <p className="mt-4 text-sm text-rn-pink">{t("cab.book.noneFree")}</p>}
          </Panel>
        </div>

        {/* Итог */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Panel className="border-rn-violet/40">
            <h2 className="mb-5 font-display text-lg font-bold uppercase">{t("cab.book.summary")}</h2>
            <dl className="space-y-3 text-sm">
              <Row icon={<Monitor className="h-4 w-4" />} label={t("cab.book.hall")} value={hall?.name ?? "—"} />
              <Row icon={<Monitor className="h-4 w-4" />} label={t("cab.seat.pc")} value={computer ? `№ ${computer.number}` : t("cab.book.notSelected")} />
              <Row icon={<CalendarDays className="h-4 w-4" />} label={t("cab.book.date")} value={formatDate(start, language, { weekday: "long" })} />
              <Row icon={<Clock className="h-4 w-4" />} label={t("cab.book.time")} value={end ? formatTimeRange(startIso, end.toISOString(), language) : "—"} />
              <Row icon={<Clock className="h-4 w-4" />} label={t("cab.book.tariff")} value={
                  tariff
                    ? durationInName(tariff.name, tariff.durationMinutes)
                      ? translateTariffName(tariff.name, language)
                      : `${translateTariffName(tariff.name, language)} · ${formatDuration(tariff.durationMinutes, t)}`
                    : "—"
                } />
            </dl>
            <div className="my-5 h-px bg-rn-line" />
            <div className="flex items-baseline justify-between">
              <span className="text-rn-muted">{t("cab.book.total")}</span>
              <span className="font-display text-3xl font-black">{tariff ? formatMoney(tariff.price) : "—"}</span>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-2xl border border-rn-pink/40 bg-rn-pink/10 p-3 text-sm text-rn-pink"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={submit}
              disabled={!tariff || !computer || submitting || startInPast}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rn-magenta via-rn-purple to-rn-electric py-4 font-display text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(217,70,239,0.35)] transition hover:shadow-[0_0_44px_rgba(217,70,239,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {sessionStatus === "authenticated" ? t("cab.book.pay") : t("cab.book.loginToPay")}
            </button>
            <p className="mt-4 flex gap-2 text-xs text-rn-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-rn-cyan" />
              {t("cab.book.holdNote").replace("{min}", String(BOOKING_HOLD_MINUTES))}
            </p>
          </Panel>
        </div>
      </div>
    </CabinetShell>
  );
}

function minPrice(tariffs: TariffDTO[], categoryId: string) {
  const prices = tariffs.filter((t) => t.categoryId === categoryId).map((t) => t.price);
  return prices.length ? Math.min(...prices) : Infinity;
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 font-display text-base font-bold uppercase">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rn-violet/60 bg-rn-violet/15 text-sm">{n}</span>
      {title}
    </h2>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-rn-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}
