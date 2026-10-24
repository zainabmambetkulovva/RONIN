import { NextResponse } from "next/server";
import { handle, unauthorized } from "@/server/http";
import { expireStaleBookings } from "@/server/services/bookings";

export const dynamic = "force-dynamic";

/**
 * Cron: обслуживание статусов бронирований.
 *  - pending без оплаты дольше срока удержания → expired (компьютер освобождается);
 *  - confirmed, время которых закончилось → completed.
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
  console.log(`[CRON] expire-bookings: expired=${result.expired} completed=${result.completed}`);

  return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
}

export const GET = handle(run);
export const POST = handle(run);
