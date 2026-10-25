/** Статистика панели управления — только реальные данные из БД. */
import { prisma } from "@/lib/prisma";
import { blockingBookingWhere, holdCutoff } from "@/server/services/availability";
import { listComputersWithState } from "@/server/services/computers";
import { BISHKEK_OFFSET_MIN, periodRange, type StatsPeriod } from "@/server/time";
import type { AdminStatsDTO } from "@/types/api";

function bishkekDayKey(d: Date) {
  return new Date(d.getTime() + BISHKEK_OFFSET_MIN * 60_000).toISOString().slice(0, 10);
}

export async function getAdminStats(period: StatsPeriod): Promise<AdminStatsDTO> {
  const { from, to } = periodRange(period);
  const now = new Date();

  const [computers, activeNow, awaitingPayment, inPeriod, cancelledInPeriod, activeSessions, sessionsInPeriod, payments, clientsTotal, newClients] =
    await Promise.all([
      listComputersWithState(),
      prisma.bookings.count({ where: { AND: [blockingBookingWhere(now), { start_at: { lte: now }, end_at: { gt: now } }] } }),
      prisma.bookings.count({
        where: { status: "pending", created_at: { gt: holdCutoff(now) }, OR: [{ payment_status: null }, { payment_status: { not: "paid" } }] },
      }),
      prisma.bookings.count({ where: { created_at: { gte: from, lt: to } } }),
      prisma.bookings.count({ where: { status: "cancelled", updated_at: { gte: from, lt: to } } }),
      prisma.gaming_sessions.count({ where: { status: "active" } }),
      prisma.gaming_sessions.count({ where: { started_at: { gte: from, lt: to } } }),
      prisma.payments.findMany({
        where: { status: "paid", paid_at: { gte: from, lt: to } },
        select: { amount: true, provider: true, paid_at: true },
      }),
      prisma.users.count({ where: { role: "client", status: { not: "deleted" } } }),
      prisma.users.count({ where: { role: "client", created_at: { gte: from, lt: to } } }),
    ]);

  // Выручка по дням (все дни периода, включая нулевые)
  const days = new Map<string, number>();
  for (let t = from.getTime(); t < to.getTime(); t += 24 * 60 * 60_000) days.set(bishkekDayKey(new Date(t)), 0);
  let amount = 0;
  let online = 0;
  for (const p of payments) {
    const value = Number(p.amount);
    amount += value;
    if (!p.provider?.startsWith("offline:")) online += value;
    if (p.paid_at) {
      const key = bishkekDayKey(p.paid_at);
      days.set(key, (days.get(key) ?? 0) + value);
    }
  }

  return {
    period: { from: from.toISOString(), to: to.toISOString(), key: period },
    computers: {
      total: computers.length,
      available: computers.filter((c) => c.state === "available").length,
      occupied: computers.filter((c) => c.state === "occupied").length,
      maintenance: computers.filter((c) => c.state === "maintenance").length,
    },
    bookings: { activeNow, awaitingPayment, inPeriod, cancelledInPeriod },
    sessions: { active: activeSessions, inPeriod: sessionsInPeriod },
    payments: { count: payments.length, amount, online, offline: amount - online },
    clients: { total: clientsTotal, newInPeriod: newClients },
    revenueByDay: Array.from(days.entries()).map(([day, value]) => ({ day, amount: value })),
  };
}
