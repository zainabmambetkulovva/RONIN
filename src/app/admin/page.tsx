"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Button, Card, ErrorNote, Loading, PageHeader, StatTile, fmtMoney, useLoader } from "@/components/admin/ui";

const PERIODS = [
  { key: "today", label: "Сегодня" },
  { key: "week", label: "7 дней" },
  { key: "month", label: "30 дней" },
] as const;

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const { data, error, loading, reload } = useLoader(() => adminApi.stats(period).then((r) => r.stats), [period]);

  const maxDay = Math.max(1, ...(data?.revenueByDay.map((d) => d.amount) ?? [1]));

  return (
    <>
      <PageHeader
        title="Обзор клуба"
        subtitle="Все показатели считаются по данным системы. Время — Бишкек."
        actions={
          <>
            <div className="flex rounded-xl border border-rn-line p-0.5" role="tablist" aria-label="Период">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={period === p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${period === p.key ? "bg-rn-violet/30 text-white" : "text-rn-muted hover:text-white"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button onClick={reload} aria-label="Обновить">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        }
      />

      {error && <ErrorNote>{error}</ErrorNote>}
      {loading && !data && <Loading />}

      {data && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-rn-muted">Компьютеры сейчас</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatTile label="Всего" value={data.computers.total} accent="violet" />
              <StatTile label="🟢 Свободны" value={data.computers.available} accent="green" />
              <StatTile label="🔴 Заняты" value={data.computers.occupied} accent="red" />
              <StatTile label="⚫ Обслуживание" value={data.computers.maintenance} accent="gray" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-rn-muted">Бронирования и сессии</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatTile label="Идут сейчас" value={data.bookings.activeNow} accent="cyan" />
              <StatTile label="Игровые сессии" value={data.sessions.active} hint={`за период: ${data.sessions.inPeriod}`} accent="cyan" />
              <StatTile label="Ждут оплаты" value={data.bookings.awaitingPayment} accent="pink" />
              <StatTile label="Брони за период" value={data.bookings.inPeriod} hint={`отменено: ${data.bookings.cancelledInPeriod}`} accent="violet" />
            </div>
          </section>

          {data.payments && (
            <section className="grid gap-3 lg:grid-cols-[1fr_2fr]">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <StatTile label="Выручка за период" value={fmtMoney(data.payments.amount)} hint={`${data.payments.count} платежей`} accent="green" />
                <StatTile label="Онлайн / в клубе" value={`${fmtMoney(data.payments.online)}`} hint={`в клубе: ${fmtMoney(data.payments.offline)}`} accent="violet" />
              </div>
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-rn-muted">Выручка по дням</h2>
                  <Link href="/admin/payments" className="text-xs text-rn-cyan hover:text-white">
                    Все платежи →
                  </Link>
                </div>
                <div className="flex h-40 justify-center gap-1" role="img" aria-label="Выручка по дням">
                  {data.revenueByDay.map((d) => (
                    <div key={d.day} className="group relative flex max-w-16 flex-1 flex-col items-center justify-end" title={`${d.day}: ${fmtMoney(d.amount)}`}>
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-rn-violet to-rn-cyan transition group-hover:from-rn-magenta"
                        style={{ height: `${Math.max(2, (d.amount / maxDay) * 100)}%`, opacity: d.amount ? 1 : 0.25 }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-rn-muted">
                  <span>{data.revenueByDay[0]?.day.slice(5)}</span>
                  <span>{data.revenueByDay[data.revenueByDay.length - 1]?.day.slice(5)}</span>
                </div>
              </Card>
            </section>
          )}

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile label="Клиентов всего" value={data.clients.total} accent="violet" />
            <StatTile label="Новых за период" value={data.clients.newInPeriod} accent="cyan" />
          </section>
        </div>
      )}
    </>
  );
}
