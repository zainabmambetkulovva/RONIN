"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Wrench, CheckCircle2, Pencil } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ApiClientError } from "@/lib/api-client";
import { useStaff } from "@/components/admin/StaffShell";
import {
  BookingBadges,
  Button,
  ComputerStateBadge,
  Empty,
  ErrorNote,
  Loading,
  Modal,
  PageHeader,
  SearchInput,
  Select,
  computerStateDot,
  fmtDateTime,
  fmtTime,
  useLoader,
} from "@/components/admin/ui";
import { Dropdown } from "@/components/ui/Dropdown";
import { ClubMap } from "@/components/map/ClubMap";
import type { AdminComputerDTO, CategoryDTO } from "@/types/api";
import { ROOM_MAX_PCS } from "@/config/club-layout";

export default function ComputersPage() {
  const staff = useStaff();
  const { data, error, loading, reload } = useLoader(() => adminApi.computers().then((r) => r.computers));
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [q, setQ] = useState("");
  const [state, setState] = useState("all");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<AdminComputerDTO | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    adminApi.categories().then((r) => setCategories(r.categories)).catch(() => undefined);
    // Состояние ПК меняется со временем — обновляем раз в минуту
    const id = setInterval(reload, 60_000);
    return () => clearInterval(id);
  }, [reload]);

  const list = useMemo(
    () =>
      (data ?? []).filter(
        (c) => (state === "all" || c.state === state) && (category === "all" || c.category.id === category) && (!q || String(c.number).includes(q.trim()))
      ),
    [data, q, state, category]
  );

  const counts = useMemo(() => {
    const all = data ?? [];
    return { available: all.filter((c) => c.state === "available").length, occupied: all.filter((c) => c.state === "occupied").length, maintenance: all.filter((c) => c.state === "maintenance").length };
  }, [data]);

  return (
    <>
      <PageHeader
        title="Компьютеры"
        subtitle={data ? `Всего ${data.length} · 🟢 ${counts.available} · 🔴 ${counts.occupied} · ⚫ ${counts.maintenance}` : undefined}
        actions={
          staff.role === "admin" && (
            <Button variant="primary" className="min-h-[52px] px-7 text-base" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Добавить ПК
            </Button>
          )
        }
      />

      {/* 3D-карта зала: занятость сейчас или в выбранное время, у кого бронь */}
      <section className="mb-6">
        <ClubMap mode="staff" compact />
      </section>

      <div className="mb-5 flex flex-wrap gap-2">
        <SearchInput value={q} onChange={setQ} placeholder="Номер компьютера" />
        <Select
          label="Состояние"
          value={state}
          onChange={setState}
          options={[
            { value: "all", label: "Все состояния" },
            { value: "available", label: "🟢 Свободен" },
            { value: "occupied", label: "🔴 Занят" },
            { value: "maintenance", label: "⚫ Обслуживание" },
          ]}
        />
        <Select label="Зал" value={category} onChange={setCategory} options={[{ value: "all", label: "Все залы" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty>Компьютеры не найдены</Empty>}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="group relative rounded-xl border border-rn-line bg-rn-surface/80 p-3 text-left transition hover:-translate-y-0.5 hover:border-rn-violet/60"
            aria-label={`ПК ${c.number}, ${c.category.name}`}
          >
            <span className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full ${computerStateDot(c.state)}`} aria-hidden />
            <div className="font-display text-xl font-bold">{c.number}</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-rn-muted">{c.category.name}</div>
            <div className="mt-1 truncate text-[11px] text-white/70">
              {c.activeSession ? c.activeSession.userName : c.currentBooking ? `до ${fmtTime(c.currentBooking.endAt)}` : c.nextBooking ? `с ${fmtTime(c.nextBooking.startAt)}` : " "}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ComputerModal
          computer={selected}
          categories={categories}
          isAdmin={staff.role === "admin"}
          onClose={() => setSelected(null)}
          onChanged={async () => {
            await reload();
          }}
        />
      )}
      {creating && (
        <CreateComputerModal
          categories={categories}
          onClose={() => setCreating(false)}
          onCreated={() => {
            reload();
            // Новый зал должен появиться в списке
            adminApi.categories().then((r) => setCategories(r.categories)).catch(() => undefined);
          }}
        />
      )}
    </>
  );
}

function ComputerModal({
  computer,
  categories,
  isAdmin,
  onClose,
  onChanged,
}: {
  computer: AdminComputerDTO;
  categories: CategoryDTO[];
  isAdmin: boolean;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const details = useLoader(() => adminApi.computer(computer.id), [computer.id]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ number: String(computer.number), categoryId: computer.category.id });
  const [status, setStatus] = useState(computer.status);

  const toggle = async () => {
    const next = status === "maintenance" ? "available" : "maintenance";
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await adminApi.setComputerStatus(computer.id, next);
      setStatus(next);
      setNotice(
        next === "maintenance"
          ? `ПК переведён на обслуживание.${res.upcomingBookings ? ` Внимание: на нём ${res.upcomingBookings} будущих броней — перенесите их.` : ""}`
          : "ПК снова доступен для бронирования."
      );
      await onChanged();
      details.reload();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось изменить статус");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminApi.updateComputer(computer.id, { number: Number(form.number), categoryId: form.categoryId });
      setEditing(false);
      setNotice("Данные компьютера сохранены");
      await onChanged();
      details.reload();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`ПК № ${details.data?.computer.number ?? computer.number}`} wide>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <ComputerStateBadge state={status === "maintenance" ? "maintenance" : computer.state === "maintenance" ? "available" : computer.state} />
          <span className="text-sm text-rn-muted">{details.data?.computer.category.name ?? computer.category.name}</span>
          {computer.activeSession && <span className="text-sm text-emerald-300">Играет: {computer.activeSession.userName} с {fmtTime(computer.activeSession.startedAt)}</span>}
        </div>

        {error && <ErrorNote>{error}</ErrorNote>}
        {notice && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}

        <div className="flex flex-wrap gap-2">
          <Button variant={status === "maintenance" ? "success" : "danger"} loading={busy} onClick={toggle}>
            {status === "maintenance" ? <CheckCircle2 className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
            {status === "maintenance" ? "Вернуть в работу" : "На обслуживание"}
          </Button>
          {isAdmin && !editing && (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Изменить
            </Button>
          )}
        </div>

        {editing && (
          <div className="grid gap-2 rounded-2xl border border-rn-line p-4 sm:grid-cols-[120px_1fr_auto]">
            <input type="number" min={1} className="rounded-xl border border-rn-line bg-rn-night px-3 py-2" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} aria-label="Номер" />
            <Dropdown label="Зал" value={form.categoryId} onChange={(v) => setForm({ ...form, categoryId: v })} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
            <Button variant="primary" loading={busy} onClick={save}>
              Сохранить
            </Button>
          </div>
        )}

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">Брони (последние сутки и будущие)</h3>
          {details.loading && <Loading />}
          {details.data && details.data.bookings.length === 0 && <Empty>Броней нет</Empty>}
          <ul className="space-y-2">
            {details.data?.bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                <span>
                  <span className="font-semibold">{b.bookingCode}</span> · {fmtDateTime(b.startAt)}–{fmtTime(b.endAt)} · {b.user?.name}
                </span>
                <BookingBadges booking={b} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">Последние сессии</h3>
          {details.data && details.data.sessions.length === 0 && <Empty>Сессий не было</Empty>}
          <ul className="space-y-2">
            {details.data?.sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                <span>
                  {s.client.name} · {fmtDateTime(s.startedAt)}
                  {s.endedAt ? `–${fmtTime(s.endedAt)}` : ""}
                </span>
                <span className="text-rn-muted">
                  {s.durationMinutes} мин · {s.status === "active" ? "идёт" : s.status === "expired" ? "время вышло" : "завершена"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Modal>
  );
}

const NEW_HALL = "__new__";

function CreateComputerModal({ categories, onClose, onCreated }: { categories: CategoryDTO[]; onClose: () => void; onCreated: () => void }) {
  const [number, setNumber] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? NEW_HALL);
  const [newHall, setNewHall] = useState("");
  const [busy, setBusy] = useState(false);
  const isNewHall = categoryId === NEW_HALL;
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminApi.createComputer(isNewHall ? { number: Number(number), newCategoryName: newHall.trim() } : { number: Number(number), categoryId });
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось добавить");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Новый компьютер">
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-rn-muted">Номер</span>
          <input type="number" min={1} className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2" value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-rn-muted">Зал</span>
          <Dropdown
            label="Зал"
            value={categoryId}
            onChange={setCategoryId}
            options={[...categories.map((c) => ({ value: c.id, label: c.name })), { value: NEW_HALL, label: "+ Новый зал" }]}
          />
        </label>
        {isNewHall && (
          <label className="block text-sm">
            <span className="mb-1 block text-rn-muted">Название нового зала</span>
            <input className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2" placeholder="Например RONIN ROOMS" value={newHall} onChange={(e) => setNewHall(e.target.value)} />
          </label>
        )}
        <p className="text-xs text-rn-muted">Зал, в котором {ROOM_MAX_PCS} ПК или меньше, на 3D-карте показывается отдельными комнатами — по комнате на каждый ПК.</p>
        {error && <ErrorNote>{error}</ErrorNote>}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="primary" loading={busy} disabled={!number || (isNewHall ? newHall.trim().length < 2 : !categoryId)} onClick={submit}>
            Добавить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
