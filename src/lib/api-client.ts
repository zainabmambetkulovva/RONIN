/**
 * Типизированный клиент API для браузера.
 *
 * Новые и переделываемые компоненты (редизайн, PWA, будущее мобильное приложение) обращаются
 * к бэкенду только через эти функции — так URL, формат ответов и обработка ошибок
 * описаны в одном месте, а компоненты не зависят от деталей API.
 */
import type {
  ApiErrorBody,
  AvatarDTO,
  BookingDTO,
  CategoryDTO,
  ComputerDTO,
  CurrentUserDTO,
  TariffDTO,
} from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const body = data as Partial<ApiErrorBody> | null;
    throw new ApiClientError(response.status, body?.error || "Ошибка сервера", body?.code || "error");
  }
  return data as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

function query(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export const api = {
  // --- Аккаунт ---
  me: () => request<{ user: CurrentUserDTO }>("/api/user/profile"),
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    request<{ success: true; user: CurrentUserDTO }>("/api/user/profile", json("PATCH", data)),
  login: (email: string, password: string) =>
    request<{ success: true }>("/api/auth/login", json("POST", { email, password })),
  register: (data: { name: string; email?: string; phone?: string; password: string }) =>
    request<{ success: true }>("/api/auth/register", json("POST", data)),
  logout: () => request<{ success: true }>("/api/auth/logout", json("POST")),
  /** Google OAuth — полный переход на страницу Google, не fetch. */
  googleLoginUrl: "/api/auth/google",

  // --- Справочники ---
  categories: () => request<{ categories: CategoryDTO[]; total: number }>("/api/categories"),
  tariffs: (categoryId?: string) =>
    request<{ tariffs: TariffDTO[]; total: number }>(`/api/tariffs${query({ categoryId })}`),
  computers: (params: { categoryId?: string; start?: string; durationMinutes?: number } = {}) =>
    request<{ computers: ComputerDTO[]; total: number }>(`/api/computers${query(params)}`),
  avatars: () => request<{ avatars: AvatarDTO[] }>("/api/avatars"),

  // --- Бронирования ---
  myBookings: () => request<{ bookings: BookingDTO[]; total: number }>("/api/bookings"),
  booking: (id: string) => request<{ booking: BookingDTO }>(`/api/bookings/${encodeURIComponent(id)}`),
  createBooking: (data: { computerId: string; tariffId: string; startAt: string }) =>
    request<{ success: true; booking: BookingDTO }>("/api/bookings", json("POST", data)),
  cancelBooking: (id: string) =>
    request<{ success: true; booking: BookingDTO }>(`/api/bookings/${encodeURIComponent(id)}/cancel`, json("POST")),
  /** Ссылка на оплату Finik для своей неоплаченной брони. */
  payBooking: (bookingId: string) =>
    request<{ success: true; paymentUrl: string }>("/api/finik/create-payment", json("POST", { bookingId })),
};
