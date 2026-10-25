"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { BookingActions } from "@/components/admin/BookingActions";
import { NewBookingModal } from "@/components/admin/NewBookingModal";
import { BookingBadges, Button, Empty, ErrorNote, Loading, Modal, PageHeader, SearchInput, Select, Table, fmtMoney, fmtTime, useLoader } from "@/components/admin/ui";
import { dayKey } from "@/lib/format";
import { ClubPulse } from "@/components/admin/ClubPulse";
import { DatePicker } from "@/components/ui/DatePicker";
import type { BookingDTO } from "@/types/api";

function dayRange(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return { from: new Date(y, m - 1, d).toISOString(), to: new Date(y, m - 1, d + 1).toISOString() };
}

export default function AdminBookingsPage() {
  const [day, setDay] = useState(dayKey(new Date()));
  // По умолчанию — все брони, новые сверху (бронь на завтра не должна «теряться» за фильтром дня)
  const [allDays, setAllDays] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<BookingDTO | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q]);

  const { data, error, loading, reload } = useLoader(
    () => adminApi.bookings({ q: debouncedQ || undefined, status, ...(allDays || debouncedQ ? {} : dayRange(day)) }).then((r) => r.bookings),
    [day, allDays, status, debouncedQ]
  );

  const refreshSelected = async () => {
    await reload();
    if (selected) {
      const { bookings } = await adminApi.bookings({ code: selected.bookingCode });
      setSelected(bookings.find((b) => b.id === selected.id) ?? null);
    }
  };

  return (
    <>
      <PageHeader
        title="Бронирования"
        subtitle={data ? `Найдено: ${data.length}` : undefined}
        actions={
          <>
            <Button onClick={reload} aria-label="Обновить">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Новая бронь
            </Button>
          </>
        }
      />

      <ClubPulse />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <SearchInput value={q} onChange={setQ} placeholder="Код, номер, имя или телефон" />
        <DatePicker value={day} onChange={setDay} label="День" disabled={allDays || !!debouncedQ} />
        <label className="flex items-center gap-2 text-sm text-rn-muted">
          <input type="checkbox" checked={allDays} onChange={(e) => setAllDays(e.target.checked)} className="accent-fuchsia-500" /> Все дни
        </label>
        <Select
          label="Статус"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Все статусы" },
            { value: "pending", label: "Ждут оплаты" },
            { value: "confirmed", label: "Подтверждены" },
            { value: "completed", label: "Завершены" },
            { value: "cancelled", label: "Отменены" },
            { value: "expired", label: "Истекли" },
          ]}
        />
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && !data && <Loading />}
      {data && data.length === 0 && <Empty>Броней нет</Empty>}

      {data && data.length > 0 && (
        <Table head={["Код", "Время", "Клиент", "ПК", "Тариф", "Цена", "Статус"]}>
          {data.map((b) => (
            <tr key={b.id} onClick={() => setSelected(b)} className="cursor-pointer transition hover:bg-white/[0.03]" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(b)}>
              <td className="px-4 py-3 font-display font-bold tracking-wider">{b.bookingCode}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {new Date(b.startAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })} {fmtTime(b.startAt)}–{fmtTime(b.endAt)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{b.user?.name}</div>
                <div className="text-xs text-rn-muted">{b.user?.phone ?? b.user?.email}</div>
              </td>
              <td className="px-4 py-3">
                № {b.computer.number} <span className="text-xs text-rn-muted">{b.computer.category.name}</span>
              </td>
              <td className="px-4 py-3">{b.tariff.name}</td>
              <td className="whitespace-nowrap px-4 py-3">{fmtMoney(b.price)}</td>
              <td className="px-4 py-3">
                <BookingBadges booking={b} />
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Бронь" wide>
        {selected && <BookingActions booking={selected} onChanged={refreshSelected} />}
      </Modal>
      <NewBookingModal open={creating} onClose={() => setCreating(false)} onCreated={reload} />
    </>
  );
}
