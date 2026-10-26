"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CalendarClock, CheckCircle2, Wallet, MonitorCheck, MonitorX, RefreshCw, Timer, UserPlus, Users, Wrench } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { useStaff } from "@/components/admin/StaffShell";
import { QuickDesk } from "@/components/admin/QuickDesk";
import { ClubMap } from "@/components/map/ClubMap";
import { AreaChart, Donut, Gauge } from "@/components/admin/charts";
import { BookingBadges, Empty, ErrorNote, IconStat, Loading, Select, fmtDateTime, fmtMoney, fmtTime, useLoader } from "@/components/admin/ui";

const PERIODS = [
  { key: "today", label: "Сегодня" },
  { key: "week", label: "7 дней" },
  { key: "month", label: "30 дней" },
] as const;

type Period = (typeof PERIODS)[number]["key"];

/** Обзор клуба для администратора: все цифры — из базы, без примерных данных. */
export default function AdminDashboardPage() {
  const staff = useStaff();
  const [period, setPeriod] = useState<Period>("week");
  const stats = useLoader(() => adminApi.stats(period).then((r) => r.stats), [period]);
  const recent = useLoader(() => adminApi.bookings({}).then((r) => r.bookings.slice(0, 6)), []);
  const sessions = useLoader(() => adminApi.sessions("active").then((r) => r.sessions), []);

  const reloadAll = () => {
    stats.reload();
    recent.reload();
    sessions.reload();
  };

  const data = stats.data;
  const load = data && data.computers.total > 0 ? (data.computers.occupied / data.computers.total) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">Обзор клуба</h1>
          <p className="mt-1 text-sm text-rn-muted">Здравствуйте, {staff.name}. Данные из системы, время — Бишкек.</p>
        </div>
        <button onClick={reloadAll} className="flex h-10 items-center gap-2 rounded-xl border border-rn-line bg-rn-surface px-4 text-sm text-rn-muted transition hover:text-white" aria-label="Обновить">
          <RefreshCw className={`h-4 w-4 ${stats.loading ? "animate-spin" : ""}`} /> Обновить
        </button>
      </div>

      {/* Смена: бронь по коду, оплата в клубе, старт сессии, бронь для гостя — и админу, и менеджеру */}
      <QuickDesk onChanged={reloadAll} />

      {stats.error && <ErrorNote>{stats.error}</ErrorNote>}
      {stats.loading && !data && <Loading />}

      {data && (
        <>
          {/* Ряд 1: текущее состояние + загрузка зала */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Сейчас в клубе" action={<Link href="/admin/computers" className="text-xs text-rn-cyan hover:text-white">Компьютеры →</Link>}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <IconStat icon={<MonitorCheck className="h-5 w-5" />} color="bg-emerald-500" value={data.computers.available} label="Свободно" />
                <IconStat icon={<MonitorX className="h-5 w-5" />} color="bg-rose-500" value={data.computers.occupied} label="Занято" />
                <IconStat icon={<Wrench className="h-5 w-5" />} color="bg-zinc-500" value={data.computers.maintenance} label="Обслуживание" />
                <IconStat icon={<Timer className="h-5 w-5" />} color="bg-rn-electric" value={data.sessions.active} label="Игровые сессии" />
                <IconStat icon={<CalendarClock className="h-5 w-5" />} color="bg-rn-magenta" value={data.bookings.awaitingPayment} label="Ждут оплаты" />
              </div>
            </Panel>
            <Panel title="Загрузка зала">
              <Gauge percent={load} label="Занято" caption={`${data.computers.occupied} из ${data.computers.total} компьютеров`} />
            </Panel>
          </div>

          {/* Ряд 2: выручка + компьютеры */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            {data.payments ? (
            <Panel
              title="Выручка"
              action={
                <Select label="Период" value={period} onChange={(v) => setPeriod(v as Period)} options={PERIODS.map((p) => ({ value: p.key, label: p.label }))} />
              }
            >
                <>
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Kpi icon={<Wallet className="h-4 w-4" />} label="За период" value={fmtMoney(data.payments.amount)} />
                    <Kpi icon={<CheckCircle2 className="h-4 w-4" />} label="Платежей" value={String(data.payments.count)} />
                    <Kpi label="Онлайн" value={fmtMoney(data.payments.online)} />
                    <Kpi label="В клубе" value={fmtMoney(data.payments.offline)} />
                  </div>
                  <AreaChart data={data.revenueByDay.map((d) => ({ label: d.day.slice(5).split("-").reverse().join("."), value: d.amount }))} format={fmtMoney} />
                </>
            </Panel>
            ) : (
              // Менеджеру выручка не показывается — вместо неё карта зала
              <div className="min-w-0">
                <ClubMap mode="staff" compact />
              </div>
            )}
            <Panel title="Компьютеры">
              <Donut
                centerLabel="Всего"
                centerValue={String(data.computers.total)}
                segments={[
                  { label: "Свободно", value: data.computers.available, color: "#10b981" },
                  { label: "Занято", value: data.computers.occupied, color: "#d946ef" },
                  { label: "Обслуживание", value: data.computers.maintenance, color: "#71717a" },
                ]}
              />
              <ul className="mt-5 space-y-2 text-sm">
                <Legend color="bg-emerald-500" label="Свободно" value={data.computers.available} />
                <Legend color="bg-rn-magenta" label="Занято" value={data.computers.occupied} />
                <Legend color="bg-zinc-500" label="Обслуживание" value={data.computers.maintenance} />
              </ul>
            </Panel>
          </div>

          {/* Ряд 3: брони + активные сессии + клиенты */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Последние брони" action={<Link href="/admin/bookings" className="text-xs text-rn-cyan hover:text-white">Все брони →</Link>}>
              {recent.loading && !recent.data && <Loading />}
              {recent.data?.length === 0 && <Empty>Броней пока нет</Empty>}
              {recent.data && recent.data.length > 0 && (
                <div className="-mx-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="text-xs text-rn-muted">
                      <tr>
                        <th className="px-5 py-2 font-medium">Дата</th>
                        <th className="px-3 py-2 font-medium">Код</th>
                        <th className="px-3 py-2 font-medium">Клиент</th>
                        <th className="px-3 py-2 font-medium">ПК</th>
                        <th className="px-3 py-2 font-medium">Сумма</th>
                        <th className="px-5 py-2 font-medium">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.data.map((b) => (
                        <tr key={b.id} className="border-t border-rn-line/60 transition hover:bg-white/[0.02]">
                          <td className="whitespace-nowrap px-5 py-3 text-rn-muted">{fmtDateTime(b.startAt)}</td>
                          <td className="px-3 py-3 font-display font-bold tracking-wider">{b.bookingCode}</td>
                          <td className="max-w-[160px] truncate px-3 py-3">{b.user?.name ?? "—"}</td>
                          <td className="px-3 py-3">№ {b.computer.number}</td>
                          <td className="whitespace-nowrap px-3 py-3">{fmtMoney(b.price)}</td>
                          <td className="px-5 py-3">
                            <BookingBadges booking={b} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
            <div className="min-w-0 space-y-5">
              <Panel title="Играют сейчас" action={<Link href="/admin/sessions" className="text-xs text-rn-cyan hover:text-white">Сессии →</Link>}>
                {sessions.data?.length === 0 && <Empty>Активных сессий нет</Empty>}
                <ul className="space-y-2">
                  {sessions.data?.slice(0, 5).map((s) => (
                    <li key={s.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rn-violet/25 font-display text-xs font-bold text-white">{s.computer.number}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-white">{s.client.name}</span>
                        <span className="block text-xs text-rn-muted">до {fmtTime(s.booking.endAt)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Клиенты">
                <div className="grid grid-cols-2 gap-3">
                  <IconStat icon={<Users className="h-5 w-5" />} color="bg-rn-violet" value={data.clients.total} label="Всего" />
                  <IconStat icon={<UserPlus className="h-5 w-5" />} color="bg-rn-cyan" value={data.clients.newInPeriod} label="Новых" />
                </div>
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-rn-line/80 bg-rn-surface/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}


function Kpi({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-rn-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 truncate font-semibold text-white">{value}</div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-rn-muted">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </li>
  );
}
