import { prisma } from "@/lib/prisma";
import type { ComputerScheduleDTO } from "@/types/api";
import { blockingBookingWhere, overlapsWhere } from "./availability";

/**
 * Расписание занятости компьютеров в окне [from, to) для 3D-карты.
 * Занятость — та же, что при бронировании (blockingBookingWhere) + идущие игровые сессии.
 * Посетителям — только интервалы; персоналу — ещё имя клиента и код брони.
 */
export async function getComputerSchedule(from: Date, to: Date, withClients: boolean): Promise<ComputerScheduleDTO[]> {
  const now = new Date();
  const [computers, bookings, sessions] = await Promise.all([
    prisma.computers.findMany({
      select: { id: true, number: true, status: true, specifications: true, computer_categories: { select: { id: true, name: true } } },
      orderBy: { number: "asc" },
    }),
    prisma.bookings.findMany({
      where: { AND: [overlapsWhere(from, to), blockingBookingWhere(now)] },
      select: {
        id: true,
        computer_id: true,
        start_at: true,
        end_at: true,
        status: true,
        payment_status: true,
        booking_code: true,
        users: withClients ? { select: { name: true } } : false,
      },
      orderBy: { start_at: "asc" },
    }),
    prisma.gaming_sessions.findMany({
      where: { status: "active" },
      select: { computer_id: true, booking_id: true, started_at: true, bookings: { select: { end_at: true } } },
    }),
  ]);

  const activeByBooking = new Map(sessions.map((s) => [s.booking_id, s]));
  const sessionByComputer = new Map(sessions.map((s) => [s.computer_id, s]));

  return computers.map((c) => {
    const busy = bookings
      .filter((b) => b.computer_id === c.id)
      .map((b) => ({
        start: b.start_at.toISOString(),
        end: b.end_at.toISOString(),
        kind: activeByBooking.has(b.id) ? ("session" as const) : b.status === "pending" && b.payment_status !== "paid" ? ("hold" as const) : ("booking" as const),
        ...(withClients && { clientName: (b as { users?: { name: string | null } | null }).users?.name ?? null, bookingCode: b.booking_code }),
      }));
    const session = sessionByComputer.get(c.id);
    // Сессия, которая идёт дольше брони (клиент ещё не закончил), — тоже занятость до «сейчас + 5 мин»
    if (session && session.bookings.end_at < now) {
      busy.push({ start: session.started_at.toISOString(), end: new Date(now.getTime() + 5 * 60_000).toISOString(), kind: "session" as const });
    }
    const specs = (c.specifications ?? {}) as Record<string, unknown>;
    return {
      id: c.id,
      number: c.number,
      maintenance: c.status === "maintenance",
      category: { id: c.computer_categories.id, name: c.computer_categories.name },
      specs: ["cpu", "gpu", "ram", "monitor"].map((k) => (typeof specs[k] === "string" ? (specs[k] as string) : null)).filter((v): v is string => !!v),
      inSessionNow: !!session,
      busy,
    };
  });
}
