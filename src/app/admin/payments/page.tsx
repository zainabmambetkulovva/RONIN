"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Button, Empty, ErrorNote, Loading, PageHeader, SearchInput, Select, StatTile, Table, fmtDateTime, fmtMoney, paymentMethodLabel, useLoader } from "@/components/admin/ui";

/** Журнал платежей — только просмотр. Статусы меняют webhook Finik и оплата в клубе. */
export default function PaymentsPage() {
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q]);

  const { data, error, loading, reload } = useLoader(
    () => adminApi.payments({ status, source: source === "all" ? undefined : source, q: debouncedQ || undefined }),
    [status, source, debouncedQ]
  );

  return (
    <>
      <PageHeader
        title="Платежи"
        subtitle="Только просмотр: оплату подтверждают Finik (онлайн) и сотрудник (в клубе)."
        actions={
          <Button onClick={reload} aria-label="Обновить">
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <SearchInput value={q} onChange={setQ} placeholder="Код или номер брони" />
        <Select
          label="Статус"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Все статусы" },
            { value: "paid", label: "Оплачен" },
            { value: "pending", label: "Ожидает" },
            { value: "failed", label: "Ошибка" },
            { value: "refunded", label: "Возврат" },
          ]}
        />
        <Select
          label="Источник"
          value={source}
          onChange={setSource}
          options={[
            { value: "all", label: "Онлайн и в клубе" },
            { value: "online", label: "Онлайн" },
            { value: "offline", label: "В клубе" },
          ]}
        />
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && !data && <Loading />}

      {data && (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile label="Платежей" value={data.total} accent="violet" />
            <StatTile label="Оплачено (по фильтру)" value={fmtMoney(data.paidAmount)} accent="green" />
          </div>
          {data.payments.length === 0 ? (
            <Empty>Платежей нет</Empty>
          ) : (
            <Table head={["Дата", "Бронь", "Клиент", "Сумма", "Цена брони", "Способ", "Статус", "Транзакция"]}>
              {data.payments.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-4 py-3">{fmtDateTime(p.paidAt ?? p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{p.booking.bookingCode}</div>
                    <div className="text-xs text-rn-muted">{p.booking.bookingNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{p.client.name}</div>
                    <div className="text-xs text-rn-muted">{p.client.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{fmtMoney(p.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-rn-muted">{fmtMoney(p.booking.price)}</td>
                  <td className="px-4 py-3">{p.provider ? paymentMethodLabel(p.provider) : p.method}</td>
                  <td className="px-4 py-3">
                    {p.status === "paid" ? <span className="text-emerald-300">Оплачен</span> : p.status === "refunded" ? <span className="text-amber-300">Возврат {p.refundedAt ? fmtDateTime(p.refundedAt) : ""}</span> : p.status === "failed" ? <span className="text-rose-300">Ошибка</span> : <span className="text-rn-muted">Ожидает</span>}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 font-mono text-xs text-rn-muted" title={p.transactionId ?? ""}>
                    {p.transactionId ?? "—"}
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </>
      )}
    </>
  );
}
