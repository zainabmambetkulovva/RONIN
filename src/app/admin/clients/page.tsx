"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { useStaff } from "@/components/admin/StaffShell";
import { BookingBadges, Empty, ErrorNote, Loading, Modal, PageHeader, SearchInput, StatTile, Table, fmtDateTime, fmtMoney, fmtTime, useLoader } from "@/components/admin/ui";
import type { ClientDTO } from "@/types/api";

export default function ClientsPage() {
  const staff = useStaff();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<ClientDTO | null>(null);
  // Запрос из поиска в шапке панели (?q=...)
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q]);

  const { data, error, loading } = useLoader(() => adminApi.clients(debouncedQ || undefined).then((r) => r.clients), [debouncedQ]);

  return (
    <>
      <PageHeader title="Клиенты" subtitle={staff.role === "admin" ? "Блокировка и роли — в разделе «Аккаунты»." : undefined} />
      <div className="mb-5">
        <SearchInput value={q} onChange={setQ} placeholder="Имя, телефон или email" />
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && !data && <Loading />}
      {data && data.length === 0 && <Empty>Клиенты не найдены</Empty>}
      {data && data.length > 0 && (
        <Table head={["Клиент", "Телефон", "Email", "Броней", "Последняя бронь", "С нами с"]}>
          {data.map((c) => (
            <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-white/[0.03]" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(c)}>
              <td className="px-4 py-3 font-medium">
                {c.name} {c.status === "blocked" && <span className="ml-2 text-xs text-rose-300">заблокирован</span>}
              </td>
              <td className="px-4 py-3">{c.phone ?? "—"}</td>
              <td className="px-4 py-3 text-rn-muted">{c.email ?? "—"}</td>
              <td className="px-4 py-3">{c.bookingsCount}</td>
              <td className="px-4 py-3">{c.lastBookingAt ? fmtDateTime(c.lastBookingAt) : "—"}</td>
              <td className="px-4 py-3 text-rn-muted">{new Date(c.createdAt).toLocaleDateString("ru-RU")}</td>
            </tr>
          ))}
        </Table>
      )}

      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function ClientModal({ client, onClose }: { client: ClientDTO; onClose: () => void }) {
  const { data, error, loading } = useLoader(() => adminApi.client(client.id), [client.id]);
  return (
    <Modal open onClose={onClose} title={client.name} wide>
      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && <Loading />}
      {data && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Телефон" value={<span className="text-base">{data.client.phone ?? "—"}</span>} />
            <StatTile label="Email" value={<span className="break-all text-base">{data.client.email ?? "—"}</span>} />
            <StatTile label="Броней" value={data.totals.bookings} accent="cyan" />
            {data.totals.paidAmount !== null && <StatTile label="Оплачено" value={fmtMoney(data.totals.paidAmount)} accent="green" />}
          </div>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">История броней</h3>
            {data.bookings.length === 0 && <Empty>Броней нет</Empty>}
            <ul className="space-y-2">
              {data.bookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                  <span>
                    <span className="font-semibold">{b.bookingCode}</span> · {fmtDateTime(b.startAt)}–{fmtTime(b.endAt)} · ПК № {b.computer.number} ·{" "}
                    {fmtMoney(b.price)}
                  </span>
                  <BookingBadges booking={b} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
}
