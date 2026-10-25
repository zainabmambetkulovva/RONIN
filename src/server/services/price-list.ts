/**
 * Прайс-лист клуба RONIN (утверждён владельцем, октябрь 2026).
 *
 * Применяется идемпотентно — кнопкой в админке («Тарифы» → «Загрузить прайс RONIN»)
 * или скриптом `npm run db:price-list`. После загрузки тарифы редактируются и удаляются
 * в админке как обычно; повторная загрузка вернёт цены к этому списку.
 *
 * Цены существующих бронирований не меняются: они зафиксированы в bookings.price.
 */
import crypto from "crypto";
import type { TariffType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface PriceItem {
  name: string;
  type: TariffType;
  durationMinutes: number;
  price: number;
}

interface PriceCategory {
  name: string;
  description: string;
  /** Существующие названия категории, которые считаются этим же залом. */
  aliases: string[];
  tariffs: PriceItem[];
}

/**
 * Длительность пакетов «Ночь» и «Утро» взята из текстов прежнего сайта (23:00–09:00 и 09:00–13:00).
 * Владелец её не подтверждал — при необходимости исправьте в админке.
 */
const NIGHT_MINUTES = 600;
const MORNING_MINUTES = 240;

function packageSet(h1: number, h3: number, h5: number, night: number, morning: number): PriceItem[] {
  return [
    { name: "1 час", type: "hourly", durationMinutes: 60, price: h1 },
    { name: "3 часа", type: "package", durationMinutes: 180, price: h3 },
    { name: "5 часов", type: "package", durationMinutes: 300, price: h5 },
    { name: "Ночь пакет", type: "night", durationMinutes: NIGHT_MINUTES, price: night },
    { name: "Утро пакет", type: "morning", durationMinutes: MORNING_MINUTES, price: morning },
  ];
}

export const RONIN_PRICE_LIST: PriceCategory[] = [
  {
    name: "COMFORT",
    description: "Общий зал",
    aliases: ["COMFORT", "КОМФОРТ", "STANDART", "STANDARD", "СТАНДАРТ"],
    tariffs: packageSet(120, 300, 500, 600, 300),
  },
  {
    name: "PREMIUM",
    description: "Premium-кабинки",
    aliases: ["PREMIUM", "ПРЕМИУМ"],
    tariffs: packageSet(250, 550, 850, 700, 550),
  },
  {
    name: "RONIN ROOMS",
    description: "Solo Ronin Room — индивидуальные комнаты",
    aliases: ["RONIN ROOMS", "RONIN ROOM", "SOLO RONIN ROOM"],
    tariffs: packageSet(400, 800, 1200, 1600, 800),
  },
];

export type PriceListAction = "create" | "update" | "unchanged";

export interface PriceListPlan {
  categories: Array<{
    name: string;
    action: "create" | "existing";
    /** Существующая категория, к которой будут привязаны тарифы. */
    matchedName: string | null;
    /** Существующая категория будет переименована в название из прайса. */
    rename: boolean;
    tariffs: Array<{ name: string; type: TariffType; durationMinutes: number; price: number; action: PriceListAction; oldPrice?: number }>;
    /** Активные тарифы этой категории, которых нет в прайсе (не изменяются). */
    extraActiveTariffs: Array<{ id: string; name: string; price: number }>;
  }>;
}

function matchesTariff(item: PriceItem, t: { type: TariffType; duration_minutes: number }) {
  // Ночной и утренний пакеты — по одному на зал; остальные — по типу и длительности
  if (item.type === "night" || item.type === "morning") return t.type === item.type;
  return t.type === item.type && t.duration_minutes === item.durationMinutes;
}

/** Что изменится при загрузке прайса (без записи в БД). */
export async function planPriceList(): Promise<PriceListPlan> {
  const categories = await prisma.computer_categories.findMany({ include: { tariffs: true } });
  const plan: PriceListPlan = { categories: [] };

  for (const pc of RONIN_PRICE_LIST) {
    const aliases = pc.aliases.map((a) => a.toUpperCase());
    const existing = categories.find((c) => aliases.includes(c.name.trim().toUpperCase())) ?? null;
    const used = new Set<string>();

    const tariffs = pc.tariffs.map((item) => {
      const match = existing?.tariffs.find((t) => !used.has(t.id) && matchesTariff(item, t));
      if (!match) return { ...item, action: "create" as const };
      used.add(match.id);
      const same =
        Number(match.price) === item.price &&
        match.name === item.name &&
        match.duration_minutes === item.durationMinutes &&
        match.is_active;
      return { ...item, action: same ? ("unchanged" as const) : ("update" as const), oldPrice: Number(match.price) };
    });

    plan.categories.push({
      name: pc.name,
      action: existing ? "existing" : "create",
      matchedName: existing?.name ?? null,
      rename: Boolean(existing && existing.name !== pc.name),
      tariffs,
      extraActiveTariffs: (existing?.tariffs ?? [])
        .filter((t) => t.is_active && !used.has(t.id))
        .map((t) => ({ id: t.id, name: t.name, price: Number(t.price) })),
    });
  }

  return plan;
}

/** Загрузить прайс. Повторный запуск не создаёт дублей. */
export async function applyPriceList(): Promise<PriceListPlan> {
  await prisma.$transaction(async (tx) => {
    const now = new Date();
    for (const pc of RONIN_PRICE_LIST) {
      const aliases = pc.aliases.map((a) => a.toUpperCase());
      const all = await tx.computer_categories.findMany({ include: { tariffs: true } });
      let category = all.find((c) => aliases.includes(c.name.trim().toUpperCase()));

      if (!category) {
        const created = await tx.computer_categories.create({
          data: {
            id: crypto.randomUUID(),
            name: pc.name,
            description: pc.description,
            is_active: true,
            created_at: now,
            updated_at: now,
          },
        });
        category = { ...created, tariffs: [] };
      } else if (category.name !== pc.name) {
        // Единое название зала на сайте и в админке (например, STANDART → COMFORT)
        await tx.computer_categories.update({ where: { id: category.id }, data: { name: pc.name, updated_at: now } });
      }

      const used = new Set<string>();
      for (const item of pc.tariffs) {
        const match = category.tariffs.find((t) => !used.has(t.id) && matchesTariff(item, t));
        if (match) {
          used.add(match.id);
          await tx.tariffs.update({
            where: { id: match.id },
            data: {
              name: item.name,
              duration_minutes: item.durationMinutes,
              price: item.price,
              type: item.type,
              is_active: true,
              updated_at: now,
            },
          });
        } else {
          await tx.tariffs.create({
            data: {
              id: crypto.randomUUID(),
              category_id: category.id,
              name: item.name,
              duration_minutes: item.durationMinutes,
              price: item.price,
              type: item.type,
              is_active: true,
              created_at: now,
              updated_at: now,
            },
          });
        }
      }
    }
  });

  return planPriceList();
}
