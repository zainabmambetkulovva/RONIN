"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Square } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ApiClientError } from "@/lib/api-client";
import { ClubPulse } from "@/components/admin/ClubPulse";
import { Button, Empty, ErrorNote, Loading, PageHeader, Table, fmtDateTime, fmtTime, useLoader } from "@/components/admin/ui";

export default function SessionsPage() {
  const [scope, setScope] = useState<"active" | "history">("active");
  const { data, error, loading, reload } = useLoader(() => adminApi.sessions(scope).then((r) => r.sessions), [scope]);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Активные сессии: длительность растёт — обновляем раз в минуту
  useEffect(() => {
    if (scope !== "active") return;
    const id = setInterval(reload, 60_000);
    return () => clearInterval(id);
  }, [scope, reload]);

  const end = async (id: string) => {
    if (!confirm("Завершить игровую сессию?")) return;
    setBusy(id);
    setActionError(null);
    try {
      await adminApi.endSession(id);
      await reload();
    } catch (e) {
      setActionError(e instanceof ApiClientError ? e.message : "Не удалось завершить сессию");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Игровые сессии"
        subtitle="Сессия начинается по оплаченной брони — в карточке брони."
        actions={
          <>
            <div className="flex rounded-xl border border-rn-line p-0.5" role="tablist">
              {(["active", "history"] as const).map((s) => (
                <button key={s} role="tab" aria-selected={scope === s} onClick={() => setScope(s)} className={`rounded-lg px-3 py-1.5 text-sm ${scope === s ? "bg-rn-violet/30 text-white" : "text-rn-muted"}`}>
                  {s === "active" ? "Активные" : "История"}
                </button>
              ))}
            </div>
            <Button onClick={reload} aria-label="Обновить">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <ClubPulse />

      {(error || actionError) && <ErrorNote>{error || actionError}</ErrorNote>}
      {loading && !data && <Loading />}
      {data && data.length === 0 && <Empty>{scope === "active" ? "Сейчас никто не играет" : "История пуста"}</Empty>}

      {data && data.length > 0 && (
        <Table head={["ПК", "Клиент", "Бронь", "Начало", "Окончание", "Длительность", "Статус", ""]}>
          {data.map((s) => {
            const overtime = s.status === "active" && Date.now() > new Date(s.booking.endAt).getTime();
            return (
              <tr key={s.id}>
                <td className="px-4 py-3">
                  <span className="font-display font-bold">№ {s.computer.number}</span> <span className="text-xs text-rn-muted">{s.computer.category}</span>
                </td>
                <td className="px-4 py-3">
                  <div>{s.client.name}</div>
                  <div className="text-xs text-rn-muted">{s.client.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{s.booking.bookingCode}</div>
                  <div className="text-xs text-rn-muted">
                    {s.booking.tariffName} · до {fmtTime(s.booking.endAt)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{fmtDateTime(s.startedAt)}</td>
                <td className="whitespace-nowrap px-4 py-3">{s.endedAt ? fmtDateTime(s.endedAt) : "—"}</td>
                <td className="px-4 py-3">{s.durationMinutes} мин</td>
                <td className="px-4 py-3">
                  {s.status === "active" ? (
                    <span className={overtime ? "text-amber-300" : "text-emerald-300"}>{overtime ? "Время брони вышло" : "Идёт"}</span>
                  ) : s.status === "expired" ? (
                    <span className="text-rn-muted">Время вышло</span>
                  ) : (
                    <span className="text-rn-muted">Завершена</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {s.status === "active" && (
                    <Button variant="danger" loading={busy === s.id} onClick={() => end(s.id)}>
                      <Square className="h-4 w-4" /> Завершить
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
