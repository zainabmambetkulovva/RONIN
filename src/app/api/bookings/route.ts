import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handle, parseJson } from "@/server/http";
import { requireUser } from "@/server/auth/session";
import { bookingInclude, toBookingDTO } from "@/server/mappers";
import { createBooking } from "@/server/services/bookings";
import { sendNewBookingNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  computerId: z.string({ required_error: "Выберите компьютер" }).min(1, "Выберите компьютер"),
  tariffId: z.string({ required_error: "Выберите тариф" }).min(1, "Выберите тариф"),
  startAt: z.coerce.date({ errorMap: () => ({ message: "Некорректное время начала" }) }),
});

// POST /api/bookings - создать бронирование (статус pending до подтверждения оплаты)
export const POST = handle(async (req) => {
  const user = await requireUser();
  const input = await parseJson(req, createSchema);

  const booking = await createBooking({ userId: user.id, ...input });

  // Уведомление администраторам в Telegram не блокирует ответ
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChatId) {
    sendNewBookingNotification(adminChatId, {
      bookingCode: booking.booking_code,
      userName: booking.users.name,
      computerName: booking.computers.computer_categories.name,
      computerNumber: booking.computers.number,
      tariffName: booking.tariffs.name,
      startAt: booking.start_at,
      endAt: booking.end_at,
      price: booking.price.toString(),
    }).catch((error) => console.error("Failed to send Telegram booking notification:", error));
  }

  return NextResponse.json({ success: true, booking: toBookingDTO(booking) }, { status: 201 });
});

// GET /api/bookings - бронирования текущего пользователя
export const GET = handle(async () => {
  const user = await requireUser();

  const bookings = await prisma.bookings.findMany({
    where: { user_id: user.id },
    include: bookingInclude,
    orderBy: { created_at: "desc" },
  });

  const items = bookings.map((b) => toBookingDTO(b, { includeUser: false }));
  return NextResponse.json({ bookings: items, total: items.length });
});
