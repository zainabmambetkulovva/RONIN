import { prisma } from "./prisma";

export type NotificationType =
  | "payment_success"
  | "booking_confirmed"
  | "booking_cancelled"
  | "session_starting_soon"
  | "session_expired"
  | "refund_processed";

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export async function createNotification(payload: NotificationPayload) {
  return prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      isRead: false,
    },
  });
}

export async function notifyPaymentSuccess(userId: string, bookingNumber: string) {
  return createNotification({
    userId,
    type: "payment_success",
    title: "Оплата успешна",
    message: `Оплата бронирования ${bookingNumber} прошла успешно.`,
  });
}

export async function notifyBookingConfirmed(userId: string, bookingNumber: string) {
  return createNotification({
    userId,
    type: "booking_confirmed",
    title: "Бронирование подтверждено",
    message: `Ваше бронирование ${bookingNumber} подтверждено. Ждём вас в клубе!`,
  });
}

export async function notifyBookingCancelled(userId: string, bookingNumber: string, reason?: string) {
  return createNotification({
    userId,
    type: "booking_cancelled",
    title: "Бронирование отменено",
    message: reason
      ? `Бронирование ${bookingNumber} отменено. Причина: ${reason}`
      : `Бронирование ${bookingNumber} отменено.`,
  });
}

export async function notifyRefund(userId: string, bookingNumber: string, amount: number) {
  return createNotification({
    userId,
    type: "refund_processed",
    title: "Возврат оформлен",
    message: `По бронированию ${bookingNumber} оформлен возврат на сумму ${amount} сом.`,
  });
}
