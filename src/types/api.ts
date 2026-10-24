/**
 * Контракт API RONIN — формы данных, которые бэкенд отдаёт фронтенду.
 *
 * Фронтенд (включая будущий редизайн, PWA и мобильное приложение) работает только с этими
 * типами и не зависит от схемы БД (snake_case Prisma). Если меняется БД — меняется маппер
 * в `src/server/mappers.ts`, а не компоненты.
 *
 * Даты передаются строками ISO 8601, деньги — числом в сомах.
 */

export type UserRole = "client" | "manager" | "admin";
export type UserStatus = "active" | "blocked" | "deleted";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "expired";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type TariffType = "hourly" | "package" | "night" | "morning";
export type ComputerStatus = "available" | "maintenance";

/** Ошибка API: `{ error, code }` + HTTP-статус. */
export interface ApiErrorBody {
  error: string;
  code: string;
}

/** Данные текущего пользователя (только его собственные). */
export interface CurrentUserDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  needsSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Пользователь в списках панели управления. Пароли и токены никогда не отдаются. */
export interface UserListItemDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  /** Совместимость с текущими компонентами (`category._count.computers`). */
  _count: { computers: number; tariffs: number };
}

export interface CategoryRefDTO {
  id: string;
  name: string;
}

export interface TariffDTO {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  type: TariffType;
  isActive: boolean;
  categoryId: string | null;
  category: CategoryRefDTO | null;
}

export interface ComputerDTO {
  id: string;
  number: number;
  categoryId: string;
  category: CategoryRefDTO & { description: string };
  specifications: unknown;
  imageUrl: string | null;
  /** Операционный статус из БД (обслуживание задаёт администратор). */
  status: ComputerStatus;
  /**
   * Свободен ли компьютер в запрошенном интервале (`?start=&durationMinutes=`).
   * `null`, если интервал не запрашивался.
   */
  availableForSlot: boolean | null;
}

export interface BookingDTO {
  id: string;
  bookingNumber: string;
  bookingCode: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus | null;
  paymentMethod: string | null;
  paidAt: string | null;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  /** Цена, зафиксированная при создании брони (не меняется при правке тарифа). */
  price: number;
  isExpired: boolean;
  createdAt: string;
  /** Для pending: до какого момента компьютер удерживается без оплаты. */
  holdExpiresAt: string | null;
  userId: string;
  user?: { id: string; name: string; email: string | null; phone: string | null; avatar: string | null };
  computer: { id: string; number: number; category: CategoryRefDTO };
  tariff: { id: string; name: string; type: TariffType };
  payments?: Array<{ status: PaymentStatus; amount: number; method: string; paidAt: string | null }>;
}

export interface AvatarDTO {
  id: string;
  code: string;
  imageUrl: string;
  isActive: boolean;
}
