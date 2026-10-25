import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { club } from "@/config/club";
import { DEFAULT_ZONES, buildLayout, type ZoneConfig } from "@/config/club-layout";

/**
 * Настройки клуба, которые меняет администратор: соцсети и зоны зала (количество ПК для 3D-карты).
 * Ключ settings "club.config" (JSON). Без записи — значения из src/config.
 */

const KEY = "club.config";

export interface ClubConfig {
  socials: { instagram: string; tiktok: string; whatsapp: string };
  zones: ZoneConfig[];
}

const DEFAULTS: ClubConfig = {
  socials: { instagram: club.socials.instagram, tiktok: club.socials.tiktok, whatsapp: club.socials.whatsapp },
  zones: DEFAULT_ZONES,
};

const url = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Ссылка должна начинаться с https://");

export const clubConfigSchema = z.object({
  socials: z.object({ instagram: url, tiktok: url, whatsapp: url }),
  zones: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Название зоны").max(24),
        count: z.coerce.number().int().min(1, "Минимум 1 ПК").max(200),
        columns: z.coerce.number().int().min(1).max(20),
        categoryId: z.string().nullable().optional(),
      })
    )
    .min(1, "Нужна хотя бы одна зона")
    .max(10)
    .refine((zones) => zones.reduce((s, z) => s + z.count, 0) <= 500, "Не больше 500 ПК"),
});

export async function getClubConfig(): Promise<ClubConfig> {
  try {
    const row = await prisma.settings.findUnique({ where: { key: KEY } });
    if (!row) return DEFAULTS;
    const parsed = clubConfigSchema.safeParse(JSON.parse(row.value));
    return parsed.success ? parsed.data : DEFAULTS;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") return DEFAULTS;
    throw e;
  }
}

export async function saveClubConfig(input: z.infer<typeof clubConfigSchema>) {
  const value = JSON.stringify(input);
  await prisma.settings.upsert({ where: { key: KEY }, create: { key: KEY, value, description: "Соцсети и зоны зала" }, update: { value } });
  return getClubConfig();
}

/**
 * Сверка схемы зала с компьютерами в базе: каких номеров не хватает и какие лишние.
 * create=true — создаёт недостающие ПК (зал — категория зоны). Существующие ПК не удаляются и не меняются.
 */
export async function syncComputers(create: boolean) {
  const config = await getClubConfig();
  const layout = buildLayout(config.zones);
  const existing = await prisma.computers.findMany({ select: { number: true } });
  const have = new Set(existing.map((c) => c.number));
  const total = layout.slots.length;

  // Номер → зона (по порядку номеров)
  const zoneOf: ZoneConfig[] = [];
  for (const zone of config.zones) for (let i = 0; i < zone.count; i++) zoneOf.push(zone);

  const missing = layout.slots.filter((s) => !have.has(s.number)).map((s) => s.number);
  const extra = existing.map((c) => c.number).filter((n) => n > total).sort((a, b) => a - b);

  let created = 0;
  const skipped: number[] = [];
  if (create && missing.length) {
    const fallback = await prisma.computer_categories.findFirst({ orderBy: { name: "asc" }, select: { id: true } });
    const data = missing
      .map((n) => ({ n, categoryId: zoneOf[n - 1]?.categoryId || fallback?.id }))
      .filter((x) => {
        if (!x.categoryId) skipped.push(x.n);
        return !!x.categoryId;
      })
      .map((x) => ({ id: crypto.randomUUID(), number: x.n, category_id: x.categoryId!, specifications: {}, updated_at: new Date() }));
    if (data.length) created = (await prisma.computers.createMany({ data, skipDuplicates: true })).count;
  }
  return { total, inDb: existing.length, missing: create ? missing.filter((n) => skipped.includes(n)) : missing, extra, created };
}
