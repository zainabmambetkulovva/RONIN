"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Search, Square } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ApiClientError } from "@/lib/api-client";
import { useStaff } from "@/components/admin/StaffShell";
import { BookingActions } from "@/components/admin/BookingActions";
import { NewBookingModal } from "@/components/admin/NewBookingModal";
import { BookingBadges, Button, Card, Empty, ErrorNote, Modal, PageHeader, StatTile, computerStateDot, fmtTime } from "@/components/admin/ui";
import type { AdminComputerDTO, BookingDTO, GamingSessionDTO } from "@/types/api";

/** Панель менеджера: операционная работа на смене. */
export default function ManagerPage() {
  const staff = useStaff();
  const [code, setCode] = useState("");
  const [found, setFound] = useState<BookingDTO | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const [computers, setComputers] = useState<AdminComputerDTO[]>([]);
  const [sessions, setSessions] = useState<GamingSessionDTO[]>([]);
  const [today, setToday] = useState<BookingDTO[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<BookingDTO | null>(null);
  const [creating, setCreating] = useState(false);
  const [ending, setEnding] = useState<string | null>(null);

  const loadAll = async () => {
    setLoadError(null);
    const start = new Date(Date.now() - 2 * 60 * 60_000);
    const end = new Date();
    end.setHours(24, 0, 0, 0);
    try {
      const [c, s, b] = await Promise.all([
        adminApi.computers(),
        adminApi.sessions("active"),
        adminApi.bookings({ from: start.toISOString(), to: end.toISOString() }),
      ]);
      setComputers(c.computers);
      setSessions(s.sessions);
      setToday(b.bookings.filter((x) => x.status !== "cancelled" && x.status !== "expired"));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Ошибка загрузки");
    }
  };

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 60_000);
    return () => clearInterval(id);
  }, []);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = code.trim();
    if (!/^\d{5}$/.test(value)) {
      setSearchError("Код брони — 5 цифр");
      return;
    }
    setSearching(true);
    setSearchError(null);
    setFound(null);
    try {
      const { bookings } = await adminApi.bookings({ code: value });
      if (bookings[0]) setFound(bookings[0]);
      else setSearchError("Бронь с таким кодом не найдена");
    } catch (err) {
      setSearchError(err instanceof ApiClientError ? err.message : "Ошибка поиска");
    } finally {
      setSearching(false);
    }
  };

  const refreshFound = async () => {
    await loadAll();
    if (found) {
      const { bookings } = await adminApi.bookings({ code: found.bookingCode });
      setFound(bookings[0] ?? null);
    }
    if (selected) {
      const { bookings } = await adminApi.bookings({ code: selected.bookingCode });
      setSelected(bookings.find((b) => b.id === selected.id) ?? null);
    }
  };

  const endSession = async (id: string) => {
    if (!confirm("Завершить игровую сессию?")) return;
    setEnding(id);
    try {
      await adminApi.endSession(id);
      await loadAll();
    } catch (e) {
      setLoadError(e instanceof ApiClientError ? e.message : "Не удалось завершить сессию");
    } finally {
      setEnding(null);
    }
  };

  const counts = useMemo(
    () => ({
      available: computers.filter((c) => c.state === "available").length,
      occupied: computers.filter((c) => c.state === "occupied").length,
      maintenance: computers.filter((c) => c.state === "maintenance").length,
    }),
    [computers]
  );

  const upcoming = today.filter((b) => new Date(b.endAt).getTime() > Date.now()).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  return (
    <>
      <PageHeader
        title="Панель менеджера"
        subtitle={`Смена: ${staff.name}`}
        actions={
          <>
            <Button onClick={loadAll} aria-label="Обновить">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Бронь для гостя
            </Button>
          </>
        }
      />

      {loadError && <ErrorNote>{loadError}</ErrorNote>}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          {/* Поиск брони по коду */}
          <Card className="p-5">
            <form onSubmit={search} className="flex gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Код брони</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rn-muted" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  inputMode="numeric"
                  placeholder="Код брони клиента"
                  className="w-full rounded-2xl border border-rn-line bg-rn-night py-3.5 pl-12 pr-4 font-display text-2xl tracking-[0.3em] text-white outline-none placeholder:font-sans placeholder:text-base placeholder:tracking-normal focus:border-rn-cyan"
                  autoFocus
                />
              </label>
              <Button type="submit" variant="primary" loading={searching} className="px-6">
                Найти
              </Button>
            </form>
            {searchError && <p className="mt-3 text-sm text-rose-300">{searchError}</p>}
            {found && (
              <div className="mt-5 border-t border-rn-line pt-5">
                <BookingActions booking={found} onChanged={refreshFound} />
              </div>
            )}
          </Card>

          {/* Брони на сегодня */}
          <Card className="p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-rn-muted">Брони до конца дня · {upcoming.length}</h2>
            {upcoming.length === 0 && <Empty>Броней на сегодня больше нет</Empty>}
            <ul className="space-y-2">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <button onClick={() => setSelected(b)} className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-3 text-left text-sm transition hover:bg-white/[0.06]">
                    <span>
                      <span className="font-display font-bold tracking-wider">{b.bookingCode}</span> · {fmtTime(b.startAt)}–{fmtTime(b.endAt)} · ПК № {b.computer.number} ·{" "}
                      {b.user?.name}
                    </span>
                    <BookingBadges booking={b} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Зал сейчас */}
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="🟢 Свободны" value={counts.available} accent="green" />
            <StatTile label="🔴 Заняты" value={counts.occupied} accent="red" />
            <StatTile label="⚫ Сервис" value={counts.maintenance} accent="gray" />
          </div>
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-rn-muted">Компьютеры</h2>
              <Link href="/admin/computers" className="text-xs text-rn-cyan hover:text-white">
                Управление →
              </Link>
            </div>
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-12">
              {computers.map((c) => (
                <span
                  key={c.id}
                  title={`ПК ${c.number} · ${c.category.name}`}
                  className="flex aspect-square items-center justify-center rounded-md border border-rn-line bg-white/[0.02] text-[10px] font-semibold"
                >
                  <span className={`mr-0.5 h-1.5 w-1.5 rounded-full ${computerStateDot(c.state)}`} aria-hidden />
                  {c.number}
                </span>
              ))}
            </div>
          </Card>

          {/* Активные сессии */}
          <Card className="p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-rn-muted">Играют сейчас · {sessions.length}</h2>
            {sessions.length === 0 && <Empty>Активных сессий нет</Empty>}
            <ul className="space-y-2">
              {sessions.map((s) => {
                const overtime = Date.now() > new Date(s.booking.endAt).getTime();
                return (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
                    <span>
                      <span className="font-display font-bold">ПК № {s.computer.number}</span> · {s.client.name} ·{" "}
                      <span className={overtime ? "text-amber-300" : "text-rn-muted"}>
                        {overtime ? "время вышло" : `до ${fmtTime(s.booking.endAt)}`}
                      </span>
                    </span>
                    <Button variant="danger" loading={ending === s.id} onClick={() => endSession(s.id)}>
                      <Square className="h-4 w-4" /> Завершить
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Бронь" wide>
        {selected && <BookingActions booking={selected} onChanged={refreshFound} />}
      </Modal>
      <NewBookingModal open={creating} onClose={() => setCreating(false)} onCreated={loadAll} />
    </>
  );
}
