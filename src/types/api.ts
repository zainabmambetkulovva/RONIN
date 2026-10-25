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
  /** Идущая сейчас игровая сессия по этой брони. */
  activeSessionId: string | null;
  payments?: Array<{ status: PaymentStatus; amount: number; method: string; paidAt: string | null }>;
}

export interface AvatarDTO {
  id: string;
  code: string;
  imageUrl: string;
  isActive: boolean;
}

// ---------- Панель управления ----------

/** Операционное состояние ПК: обслуживание задаёт персонал, «занят» — активная сессия или идущая бронь. */
export type ComputerState = "available" | "occupied" | "maintenance";

export interface AdminComputerDTO {
  id: string;
  number: number;
  status: ComputerStatus;
  state: ComputerState;
  category: CategoryRefDTO;
  specifications: unknown;
  /** Идущая сейчас игровая сессия. */
  activeSession: { id: string; startedAt: string; bookingId: string; userName: string } | null;
  /** Бронь, интервал которой включает текущий момент. */
  currentBooking: { id: string; bookingCode: string; startAt: string; endAt: string; userName: string } | null;
  /** Ближайшая будущая бронь (подтверждённая/оплаченная/удерживаемая). */
  nextBooking: { id: string; bookingCode: string; startAt: string; endAt: string } | null;
}

export type GamingSessionStatus = "active" | "completed" | "expired";

export interface GamingSessionDTO {
  id: string;
  status: GamingSessionStatus;
  startedAt: string;
  endedAt: string | null;
  /** Фактическая длительность в минутах (для активной — на текущий момент). */
  durationMinutes: number;
  computer: { id: string; number: number; category: string };
  booking: { id: string; bookingCode: string; startAt: string; endAt: string; tariffName: string };
  client: { id: string; name: string; phone: string | null };
  startedBy: { id: string; name: string };
}

export interface PaymentDTO {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  provider: string | null;
  transactionId: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  booking: { id: string; bookingCode: string; bookingNumber: string; price: number; status: BookingStatus };
  client: { id: string; name: string; phone: string | null };
}

export interface ClientDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  bookingsCount: number;
  lastBookingAt: string | null;
}

export interface AdminStatsDTO {
  period: { from: string; to: string; key: "today" | "week" | "month" };
  computers: { total: number; available: number; occupied: number; maintenance: number };
  bookings: { activeNow: number; awaitingPayment: number; inPeriod: number; cancelledInPeriod: number };
  sessions: { active: number; inPeriod: number };
  /** Только для администратора; для менеджера — null. */
  payments: { count: number; amount: number; online: number; offline: number } | null;
  clients: { total: number; newInPeriod: number };
  /** Выручка по дням периода (по Бишкеку); для менеджера — пустой массив. */
  revenueByDay: Array<{ day: string; amount: number }>;
}

/** Оформление сайта клуба (настраивается в админке). */
export interface BrandingDTO {
  clubName: string;
  /** Три цвета градиента заголовка и главных кнопок, #RRGGBB. */
  gradient: [string, string, string];
  logoUrl: string;
  heroImageUrl: string;
  customLogo: boolean;
  customHero: boolean;
}

/** Игра в блоке «Популярные игры» (список задаёт администратор). */
export interface GameDTO {
  id: string;
  name: string;
  genre: string;
  /** null — обложки нет, показывается оформленная карточка с названием. */
  imageUrl: string | null;
}

/** Занятость компьютера для 3D-карты. */
export interface ComputerScheduleDTO {
  id: string;
  number: number;
  maintenance: boolean;
  category: { id: string; name: string };
  specs: string[];
  /** Идёт игровая сессия прямо сейчас. */
  inSessionNow: boolean;
  /** Интервалы занятости (ISO), по возрастанию начала. clientName/bookingCode — только для персонала. */
  busy: Array<{ start: string; end: string; kind: "booking" | "hold" | "session"; clientName?: string | null; bookingCode?: string }>;
}
