import { NextResponse } from "next/server";
import { handle, unauthorized } from "@/server/http";
import { expireStaleBookings } from "@/server/services/bookings";
import { expireFinishedSessions } from "@/server/services/sessions";

export const dynamic = "force-dynamic";

/**
 * Cron: обслуживание статусов бронирований.
 *  - pending без оплаты дольше срока удержания → expired (компьютер освобождается);
 *  - confirmed, время которых закончилось → completed;
 *  - активные игровые сессии с закончившимся временем брони → expired.
 *
 * Требует заголовок `Authorization: Bearer <CRON_SECRET>`.
 * Vercel Cron отправляет его автоматически, если задана переменная CRON_SECRET.
 */
async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    throw unauthorized("Unauthorized");
  }

  const result = await expireStaleBookings();
  const sessionsExpired = await expireFinishedSessions();
  console.log(`[CRON] expire-bookings: expired=${result.expired} completed=${result.completed} sessions=${sessionsExpired}`);

  return NextResponse.json({ success: true, ...result, sessionsExpired, timestamp: new Date().toISOString() });
}

export const GET = handle(run);
export const POST = handle(run);
