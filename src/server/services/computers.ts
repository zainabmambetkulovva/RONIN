/**
 * Компьютеры клуба для панели управления.
 *
 * Состояние ПК:
 *  - maintenance — статус в БД, задаёт персонал;
 *  - occupied    — идёт игровая сессия или сейчас идёт бронь (подтверждённая/оплаченная/удерживаемая);
 *  - available   — иначе.
 */
import crypto from "crypto";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { conflict, notFound } from "@/server/http";
import { blockingBookingWhere } from "@/server/services/availability";
import type { AdminComputerDTO, ComputerState } from "@/types/api";

/** ПК в работе: не в архиве (архив — скрытый зал, куда убираются удалённые ПК с историей броней). */
export const activeComputerWhere = { computer_categories: { is_active: true } } satisfies Prisma.computersWhereInput;
const ARCHIVE_NAME = "АРХИВ";

/**
 * Убрать ПК из клуба. Без истории — удаляется полностью; с историей броней/сессий — уходит в скрытый архив
 * (пропадает с карты, из брони и со страниц сайта, история сохраняется).
 */
export async function removeComputer(id: string): Promise<"deleted" | "archived"> {
  const now = new Date();
  const computer = await prisma.computers.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      _count: { select: { bookings: true, gaming_sessions: true } },
      gaming_sessions: { where: { status: "active" }, select: { id: true }, take: 1 },
      bookings: { where: { AND: [blockingBookingWhere(now), { end_at: { gt: now } }] }, select: { id: true }, take: 1 },
    },
  });
  if (!computer) throw notFound("Компьютер не найден");
  if (computer.gaming_sessions.length) throw conflict(`На ПК № ${computer.number} идёт игровая сессия — сначала завершите её`, "computer_busy");
  if (computer.bookings.length) throw conflict(`У ПК № ${computer.number} есть предстоящие брони — сначала отмените или перенесите их`, "computer_busy");

  if (computer._count.bookings === 0 && computer._count.gaming_sessions === 0) {
    await prisma.computers.delete({ where: { id } });
    return "deleted";
  }
  const archive =
    (await prisma.computer_categories.findFirst({ where: { name: ARCHIVE_NAME, is_active: false }, select: { id: true } })) ??
    (await prisma.computer_categories.create({
      data: { id: crypto.randomUUID(), name: ARCHIVE_NAME, description: "Удалённые ПК с историей броней", is_active: false, updated_at: now },
      select: { id: true },
    }));
  await prisma.computers.update({ where: { id }, data: { category_id: archive.id, status: "maintenance", updated_at: now } });
  return "archived";
}

export async function listComputersWithState(): Promise<AdminComputerDTO[]> {
  const now = new Date();
  const dayAhead = new Date(now.getTime() + 24 * 60 * 60_000);

  const computers = await prisma.computers.findMany({
    where: activeComputerWhere,
    include: {
      computer_categories: { select: { id: true, name: true } },
      gaming_sessions: {
        where: { status: "active" },
        include: { bookings: { select: { id: true, users: { select: { name: true } } } } },
        take: 1,
      },
      bookings: {
        where: { AND: [blockingBookingWhere(now), { end_at: { gt: now }, start_at: { lt: dayAhead } }] },
        include: { users: { select: { name: true } } },
        orderBy: { start_at: "asc" },
        take: 3,
      },
    },
    orderBy: { number: "asc" },
  });

  return computers.map((c) => {
    const session = c.gaming_sessions[0] ?? null;
    const current = c.bookings.find((b) => b.start_at <= now && b.end_at > now) ?? null;
    const next = c.bookings.find((b) => b.start_at > now) ?? null;
    const state: ComputerState = c.status === "maintenance" ? "maintenance" : session || current ? "occupied" : "available";

    return {
      id: c.id,
      number: c.number,
      status: c.status,
      state,
      category: { id: c.computer_categories.id, name: c.computer_categories.name },
      specifications: c.specifications,
      activeSession: session
        ? { id: session.id, startedAt: session.started_at.toISOString(), bookingId: session.booking_id, userName: session.bookings.users.name }
        : null,
      currentBooking: current
        ? { id: current.id, bookingCode: current.booking_code, startAt: current.start_at.toISOString(), endAt: current.end_at.toISOString(), userName: current.users.name }
        : null,
      nextBooking: next
        ? { id: next.id, bookingCode: next.booking_code, startAt: next.start_at.toISOString(), endAt: next.end_at.toISOString() }
        : null,
    };
  });
}

/**
 * Перевод ПК на обслуживание и обратно.
 * Во время активной игровой сессии статус менять нельзя — сначала завершите сессию.
 * Возвращает число будущих броней на этом ПК, чтобы персонал мог их перенести.
 */
export async function setComputerStatus(id: string, status: "available" | "maintenance") {
  const computer = await prisma.computers.findUnique({
    where: { id },
    include: { gaming_sessions: { where: { status: "active" }, select: { id: true }, take: 1 } },
  });
  if (!computer) throw notFound("Компьютер не найден");
  if (computer.gaming_sessions.length > 0) {
    throw conflict("На компьютере идёт игровая сессия — сначала завершите её", "active_session");
  }

  const now = new Date();
  const [updated, upcomingBookings] = await Promise.all([
    prisma.computers.update({ where: { id }, data: { status, updated_at: now } }),
    prisma.bookings.count({ where: { computer_id: id, AND: [blockingBookingWhere(now), { end_at: { gt: now } }] } }),
  ]);
  return { computer: updated, upcomingBookings };
}

const computerBaseSchema = z.object({
  number: z.coerce.number().int("Номер — целое число").positive("Номер должен быть больше нуля").max(9999),
  categoryId: z.string().min(1, "Выберите зал"),
  specifications: z.record(z.unknown()).optional(),
});
export const computerCreateSchema = computerBaseSchema
  .extend({
    categoryId: z.string().optional(),
    /** Новый зал (например «RONIN ROOMS») — создаётся, если зала с таким названием ещё нет. */
    newCategoryName: z.string().trim().min(2, "Название зала — от 2 символов").max(100).optional(),
  })
  .refine((d) => d.categoryId || d.newCategoryName, { message: "Выберите зал или введите название нового" });
export const computerUpdateSchema = computerBaseSchema.partial();

/** Зал по названию (без учёта регистра) или новый зал. */
async function resolveCategory(input: { categoryId?: string; newCategoryName?: string }): Promise<string> {
  if (!input.newCategoryName) return input.categoryId!;
  const name = input.newCategoryName.trim();
  const existing = await prisma.computer_categories.findFirst({ where: { name: { equals: name, mode: "insensitive" }, is_active: true }, select: { id: true } });
  if (existing) return existing.id;
  const created = await prisma.computer_categories.create({
    data: { id: crypto.randomUUID(), name: name.toUpperCase(), description: "", is_active: true, updated_at: new Date() },
    select: { id: true },
  });
  return created.id;
}

export async function createComputer(input: z.infer<typeof computerCreateSchema>) {
  const now = new Date();
  const categoryId = await resolveCategory(input);
  try {
    return await prisma.computers.create({
      data: {
        id: crypto.randomUUID(),
        number: input.number,
        category_id: categoryId,
        specifications: (input.specifications ?? {}) as Prisma.InputJsonValue,
        status: "available",
        created_at: now,
        updated_at: now,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict(`Компьютер № ${input.number} уже существует`, "duplicate_number");
    }
    throw error;
  }
}

export async function updateComputer(id: string, input: z.infer<typeof computerUpdateSchema>) {
  try {
    return await prisma.computers.update({
      where: { id },
      data: {
        ...(input.number !== undefined && { number: input.number }),
        ...(input.categoryId !== undefined && { category_id: input.categoryId }),
        ...(input.specifications !== undefined && { specifications: input.specifications as Prisma.InputJsonValue }),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict(`Компьютер № ${input.number} уже существует`, "duplicate_number");
    }
    throw error;
  }
}
