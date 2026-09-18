import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd.MM.yyyy", { locale: ru });
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd.MM.yyyy HH:mm", { locale: ru });
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), "HH:mm", { locale: ru });
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
}

export function formatPrice(price: number | string): string {
  return `${Number(price).toLocaleString("ru-RU")} сом`;
}

export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RON-${timestamp}-${random}`;
}

export function generateQrToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function isBookingActive(startAt: Date, endAt: Date): boolean {
  const now = new Date();
  return now >= startAt && now <= endAt;
}

export function isBookingExpired(endAt: Date): boolean {
  return new Date() > new Date(endAt);
}

export function getBookingStatus(startAt: Date | string, endAt: Date | string): "active" | "expired" | "upcoming" {
  const now = new Date();
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (now > end) return "expired";
  if (now >= start && now <= end) return "active";
  return "upcoming";
}

export function calculateEndTime(startAt: Date, durationMinutes: number): Date {
  return new Date(new Date(startAt).getTime() + durationMinutes * 60 * 1000);
}
