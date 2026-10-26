/**
 * Преобразование записей Prisma (snake_case) в DTO из `src/types/api.ts`.
 * Все API-роуты отдают данные только через эти функции.
 */
import { Prisma, type users, type tariffs, type avatars } from "@prisma/client";
import type {
  AvatarDTO,
  BookingDTO,
  CategoryDTO,
  ComputerDTO,
  CurrentUserDTO,
  TariffDTO,
  UserListItemDTO,
} from "@/types/api";
import { BOOKING_HOLD_MINUTES } from "@/server/config";

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

export function toCurrentUserDTO(user: users): CurrentUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    image: user.image,
    role: user.role,
    status: user.status,
    needsSetup: !user.name || !user.avatar,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}

/** Поля пользователя, которые разрешено выбирать для панели управления. */
export const userListSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  image: true,
  role: true,
  status: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.usersSelect;

export function toUserListItemDTO(user: Prisma.usersGetPayload<{ select: typeof userListSelect }>): UserListItemDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    image: user.image,
    role: user.role,
    status: user.status,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}

export const categoryInclude = {
  _count: { select: { computers: true, tariffs: true } },
} satisfies Prisma.computer_categoriesInclude;

export function toCategoryDTO(
  category: Prisma.computer_categoriesGetPayload<{ include: typeof categoryInclude }>
): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.image_url,
    isActive: category.is_active,
    _count: { computers: category._count.computers, tariffs: category._count.tariffs },
  };
}

export const tariffInclude = {
  computer_categories: { select: { id: true, name: true } },
} satisfies Prisma.tariffsInclude;

export function toTariffDTO(
  tariff: tariffs & { computer_categories?: { id: string; name: string } | null }
): TariffDTO {
  return {
    id: tariff.id,
    name: tariff.name,
    durationMinutes: tariff.duration_minutes,
    price: Number(tariff.price),
    type: tariff.type,
    isActive: tariff.is_active,
    categoryId: tariff.category_id,
    category: tariff.computer_categories
      ? { id: tariff.computer_categories.id, name: tariff.computer_categories.name }
      : null,
  };
}

export const computerInclude = {
  computer_categories: { select: { id: true, name: true, description: true } },
} satisfies Prisma.computersInclude;

export function toComputerDTO(
  computer: Prisma.computersGetPayload<{ include: typeof computerInclude }>,
  availableForSlot: boolean | null = null
): ComputerDTO {
  return {
    id: computer.id,
    number: computer.number,
    categoryId: computer.category_id,
    category: {
      id: computer.computer_categories.id,
      name: computer.computer_categories.name,
      description: computer.computer_categories.description,
    },
    specifications: computer.specifications,
    imageUrl: computer.image_url,
    status: computer.status,
    availableForSlot,
  };
}

export const bookingInclude = {
  users: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
  computers: { select: { id: true, number: true, computer_categories: { select: { id: true, name: true } } } },
  tariffs: { select: { id: true, name: true, type: true } },
  payments: { select: { status: true, amount: true, method: true, paid_at: true } },
  gaming_sessions: { where: { status: "active" }, select: { id: true }, take: 1 },
} satisfies Prisma.bookingsInclude;

type BookingWithRelations = Prisma.bookingsGetPayload<{ include: typeof bookingInclude }>;

/**
 * @param includeUser — данные клиента отдаются персоналу и самому владельцу брони.
 */
export function toBookingDTO(booking: BookingWithRelations, { includeUser = true } = {}): BookingDTO {
  const holdExpiresAt =
    booking.status === "pending"
      ? new Date(booking.created_at.getTime() + BOOKING_HOLD_MINUTES * 60_000).toISOString()
      : null;

  return {
    id: booking.id,
    bookingNumber: booking.booking_number,
    bookingCode: booking.booking_code,
    status: booking.status,
    paymentStatus: booking.payment_status,
    paymentMethod: booking.payment_method,
    paidAt: iso(booking.paid_at),
    startAt: booking.start_at.toISOString(),
    endAt: booking.end_at.toISOString(),
    durationMinutes: booking.duration_minutes,
    price: Number(booking.price),
    isExpired: booking.is_expired,
    createdAt: booking.created_at.toISOString(),
    holdExpiresAt,
    userId: booking.user_id,
    ...(includeUser
      ? {
          user: {
            id: booking.users.id,
            name: booking.users.name,
            email: booking.users.email,
            phone: booking.users.phone,
            avatar: booking.users.avatar,
          },
        }
      : {}),
    computer: {
      id: booking.computers.id,
      number: booking.computers.number,
      category: {
        id: booking.computers.computer_categories.id,
        name: booking.computers.computer_categories.name,
      },
    },
    tariff: { id: booking.tariffs.id, name: booking.tariffs.name, type: booking.tariffs.type },
    activeSessionId: booking.gaming_sessions[0]?.id ?? null,
    payments: booking.payments.map((p) => ({
      status: p.status,
      amount: Number(p.amount),
      method: p.method,
      paidAt: iso(p.paid_at),
    })),
  };
}

export function toAvatarDTO(avatar: avatars): AvatarDTO {
  return { id: avatar.id, code: avatar.code, imageUrl: avatar.image_url, isActive: avatar.is_active };
}
