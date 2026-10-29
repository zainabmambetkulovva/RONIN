/**
 * Типизированный клиент API панели управления (admin / manager).
 * Сессия сотрудника — httpOnly cookie, поэтому заголовки авторизации не нужны.
 */
import { ApiClientError } from "@/lib/api-client";
import type {
  AdminComputerDTO,
  AdminStatsDTO,
  BookingDTO,
  CategoryDTO,
  ClientDTO,
  GamingSessionDTO,
  PaymentDTO,
  TariffDTO,
} from "@/types/api";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiClientError(res.status, data?.error || "Ошибка сервера", data?.code || "error");
  return data as T;
}

const send = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });

function qs(params: Record<string, string | undefined | null>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) s.set(k, v);
  const str = s.toString();
  return str ? `?${str}` : "";
}

export type OfflineMethod = "cash" | "card" | "qr";

export const adminApi = {
  stats: (period: "today" | "week" | "month") => request<{ stats: AdminStatsDTO }>(`/api/admin/stats${qs({ period })}`),

  computers: () => request<{ computers: AdminComputerDTO[] }>("/api/admin/computers"),
  computer: (id: string) =>
    request<{ computer: { id: string; number: number; status: string; category: { id: string; name: string } }; bookings: BookingDTO[]; sessions: GamingSessionDTO[] }>(
      `/api/admin/computers/${id}`
    ),
  setComputerStatus: (id: string, status: "available" | "maintenance") =>
    request<{ success: true; upcomingBookings: number }>(`/api/admin/computers/${id}`, send("PATCH", { status })),
  createComputer: (data: { number: number; categoryId?: string; newCategoryName?: string }) => request<{ success: true }>("/api/admin/computers", send("POST", data)),
  updateComputer: (id: string, data: { number?: number; categoryId?: string }) => request<{ success: true }>(`/api/admin/computers/${id}`, send("PATCH", data)),
  categories: () => request<{ categories: CategoryDTO[] }>("/api/categories"),

  bookings: (params: { q?: string; status?: string; from?: string; to?: string; computerId?: string; code?: string } = {}) =>
    request<{ bookings: BookingDTO[]; total: number }>(`/api/admin/bookings${qs(params)}`),
  createBooking: (data: { userId: string; computerId: string; tariffId: string; startAt: string }) =>
    request<{ booking: BookingDTO }>("/api/admin/bookings", send("POST", data)),
  cancelBooking: (id: string, reason?: string) => request<{ booking: BookingDTO }>(`/api/admin/bookings/${id}`, send("PATCH", { status: "cancelled", reason })),
  completeBooking: (id: string) => request<{ booking: BookingDTO }>(`/api/admin/bookings/${id}`, send("PATCH", { status: "completed" })),
  recordPayment: (id: string, method: OfflineMethod) =>
    request<{ success: true; outcome: string; booking: BookingDTO }>(`/api/admin/bookings/${id}/payment`, send("POST", { method })),

  sessions: (scope: "active" | "history" = "active") => request<{ sessions: GamingSessionDTO[] }>(`/api/admin/sessions${qs({ scope })}`),
  startSession: (bookingId: string) => request<{ session: GamingSessionDTO }>("/api/admin/sessions", send("POST", { bookingId })),
  endSession: (id: string) => request<{ session: GamingSessionDTO }>(`/api/admin/sessions/${id}/end`, send("POST")),

  payments: (params: { status?: string; source?: string; from?: string; to?: string; q?: string } = {}) =>
    request<{ payments: PaymentDTO[]; total: number; paidAmount: number }>(`/api/admin/payments${qs(params)}`),

  clients: (q?: string) => request<{ clients: ClientDTO[] }>(`/api/admin/clients${qs({ q })}`),
  client: (id: string) =>
    request<{
      client: { id: string; name: string; email: string | null; phone: string | null; status: string; createdAt: string };
      bookings: BookingDTO[];
      totals: { bookings: number; paidAmount: number | null };
    }>(`/api/admin/clients/${id}`),
  createClient: (data: { name: string; phone: string; email?: string }) =>
    request<{ client: { id: string; name: string; phone: string | null; email: string | null } }>("/api/admin/clients", send("POST", data)),

  tariffs: () => request<{ tariffs: TariffDTO[] }>("/api/tariffs"),
};
