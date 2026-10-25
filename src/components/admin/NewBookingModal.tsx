"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { api, ApiClientError } from "@/lib/api-client";
import { SeatGrid } from "@/components/cabinet/SeatGrid";
import type { BookingDTO, CategoryDTO, ClientDTO, ComputerDTO, TariffDTO } from "@/types/api";
import { BookingActions } from "./BookingActions";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePicker, toDayKey } from "@/components/ui/DatePicker";
import { Button, ErrorNote, Modal, fmtMoney } from "./ui";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Бронь для клиента в клубе: клиент → зал и тариф → время → ПК → создание (оплата — сразу после). */
export function NewBookingModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [q, setQ] = useState("");
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [client, setClient] = useState<{ id: string; name: string; phone: string | null } | null>(null);
  const [newClient, setNewClient] = useState({ name: "", phone: "" });
  const [creatingClient, setCreatingClient] = useState(false);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [tariffs, setTariffs] = useState<TariffDTO[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [start, setStart] = useState(() => toLocalInput(new Date(Math.ceil(Date.now() / 300_000) * 300_000)));
  const [computers, setComputers] = useState<ComputerDTO[] | null>(null);
  const [computerId, setComputerId] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<BookingDTO | null>(null);

  useEffect(() => {
    if (!open) return;
    Promise.all([adminApi.categories(), adminApi.tariffs()]).then(([c, t]) => {
      setCategories(c.categories.filter((x) => x._count.computers > 0));
      setTariffs(t.tariffs);
    });
  }, [open]);

  useEffect(() => {
    if (!categoryId && categories[0]) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const hallTariffs = useMemo(() => tariffs.filter((t) => t.categoryId === categoryId || t.categoryId === null).sort((a, b) => a.price - b.price), [tariffs, categoryId]);
  useEffect(() => {
    if (hallTariffs.length && !hallTariffs.some((t) => t.id === tariffId)) setTariffId(hallTariffs[0].id);
  }, [hallTariffs, tariffId]);
  const tariff = hallTariffs.find((t) => t.id === tariffId);

  // Поиск клиента
  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setClients([]);
      return;
    }
    const id = setTimeout(() => adminApi.clients(q.trim()).then((r) => setClients(r.clients.slice(0, 8))).catch(() => setClients([])), 300);
    return () => clearTimeout(id);
  }, [q, open]);

  // Свободные ПК на выбранный интервал
  useEffect(() => {
    if (!open || !categoryId || !tariff || !start) return;
    setComputers(null);
    api
      .computers({ categoryId, start: new Date(start).toISOString(), durationMinutes: tariff.durationMinutes })
      .then((r) => setComputers(r.computers))
      .catch(() => setComputers([]));
  }, [open, categoryId, tariff, start]);

  const reset = () => {
    setQ("");
    setClient(null);
    setNewClient({ name: "", phone: "" });
    setComputerId(null);
    setCreated(null);
    setError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const addClient = async () => {
    setBusy(true);
    setError(null);
    try {
      const { client } = await adminApi.createClient(newClient);
      setClient(client);
      setCreatingClient(false);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось создать клиента");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!client || !tariff || !computerId) return;
    setBusy(true);
    setError(null);
    try {
      const { booking } = await adminApi.createBooking({ userId: client.id, computerId, tariffId: tariff.id, startAt: new Date(start).toISOString() });
      setCreated(booking);
      onCreated();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Не удалось создать бронь");
    } finally {
      setBusy(false);
    }
  };

  const refreshCreated = async () => {
    if (!created) return;
    const { bookings } = await adminApi.bookings({ code: created.bookingCode });
    if (bookings[0]) setCreated(bookings[0]);
    onCreated();
  };

  return (
    <Modal open={open} onClose={close} title={created ? "Бронь создана" : "Новая бронь в клубе"} wide>
      {created ? (
        <div className="space-y-4">
          <p className="text-sm text-rn-muted">Примите оплату, чтобы подтвердить бронь. Неоплаченная бронь держит компьютер ограниченное время.</p>
          <BookingActions booking={created} onChanged={refreshCreated} />
          <div className="flex justify-end">
            <Button onClick={close}>Готово</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Клиент */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">1. Клиент</h3>
            {client ? (
              <div className="flex items-center justify-between rounded-xl border border-rn-violet/40 bg-rn-violet/10 px-4 py-3">
                <span>
                  <span className="font-semibold">{client.name}</span> <span className="text-sm text-rn-muted">{client.phone}</span>
                </span>
                <Button variant="ghost" onClick={() => setClient(null)}>
                  Изменить
                </Button>
              </div>
            ) : creatingClient ? (
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input className="rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-sm outline-none focus:border-rn-cyan" placeholder="Имя" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                <input className="rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-sm outline-none focus:border-rn-cyan" placeholder="+996 …" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                <Button variant="primary" loading={busy} onClick={addClient} disabled={!newClient.name || !newClient.phone}>
                  Добавить
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <label className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rn-muted" />
                    <input className="w-full rounded-xl border border-rn-line bg-rn-night py-2 pl-9 pr-3 text-sm outline-none focus:border-rn-cyan" placeholder="Имя, телефон или email" value={q} onChange={(e) => setQ(e.target.value)} />
                  </label>
                  <Button onClick={() => setCreatingClient(true)}>
                    <UserPlus className="h-4 w-4" /> Новый
                  </Button>
                </div>
                {clients.length > 0 && (
                  <ul className="mt-2 divide-y divide-rn-line/60 rounded-xl border border-rn-line">
                    {clients.map((c) => (
                      <li key={c.id}>
                        <button className="flex w-full justify-between px-4 py-2.5 text-left text-sm hover:bg-white/[0.04]" onClick={() => setClient(c)}>
                          <span className="font-medium">{c.name}</span>
                          <span className="text-rn-muted">{c.phone ?? c.email}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          {/* Зал, тариф, время */}
          <section className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rn-muted">2. Зал</span>
              <Dropdown label="Зал" value={categoryId} onChange={setCategoryId} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rn-muted">Тариф</span>
              <Dropdown label="Тариф" value={tariffId} onChange={setTariffId} options={hallTariffs.map((t) => ({ value: t.id, label: `${t.name} — ${fmtMoney(t.price)}` }))} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rn-muted">Начало</span>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <DatePicker label="День" value={start.slice(0, 10)} min={toDayKey(new Date())} onChange={(d) => setStart(`${d}T${start.slice(11, 16)}`)} />
                <Dropdown
                  label="Время"
                  className="w-28"
                  value={start.slice(11, 16)}
                  onChange={(time) => setStart(`${start.slice(0, 10)}T${time}`)}
                  options={timeOptions(start.slice(11, 16))}
                />
              </div>
            </label>
          </section>

          {/* ПК */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">3. Компьютер</h3>
            {computers === null ? <p className="text-sm text-rn-muted">Проверяем свободные ПК…</p> : <SeatGrid computers={computers} selectedId={computerId} onSelect={(c) => setComputerId(c.id)} />}
          </section>

          {error && <ErrorNote>{error}</ErrorNote>}
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Отмена</Button>
            <Button variant="primary" loading={busy} disabled={!client || !tariff || !computerId} onClick={submit}>
              Создать бронь{tariff ? ` · ${fmtMoney(tariff.price)}` : ""}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Время с шагом 15 минут (+ текущее значение, если оно не на сетке). */
function timeOptions(current: string) {
  const list: string[] = [];
  for (let m = 0; m < 24 * 60; m += 15) list.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  if (current && !list.includes(current)) list.push(current);
  return list.sort().map((v) => ({ value: v, label: v }));
}
