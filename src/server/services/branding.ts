import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { BrandingDTO } from "@/types/api";

/**
 * Оформление сайта клуба (white-label): название, логотип, картинка первого экрана, цвета градиента.
 * Хранится в таблице settings (ключ → значение); картинки — отдельными ключами как data URL,
 * отдаются через /api/branding/image/[slot] с долгим кэшем.
 */

const KEY = "branding";
export const IMAGE_KEYS = { logo: "branding.logo", hero: "branding.hero" } as const;
export type ImageSlot = keyof typeof IMAGE_KEYS;

export const DEFAULT_BRANDING = {
  clubName: "RONIN",
  gradient: ["#e9d5ff", "#d946ef", "#22d3ee"] as [string, string, string],
  logoUrl: "/logo-new.png",
  heroImageUrl: "/brand/samurai.png",
};

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Цвет в формате #RRGGBB");
/** Картинка из админки: data URL png/jpeg/webp, до ~2 МБ. null — вернуть стандартную. */
const image = z
  .string()
  .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "Картинка: PNG, JPEG или WebP")
  .max(2_800_000, "Картинка слишком большая (до 2 МБ)")
  .nullable()
  .optional();

export const brandingUpdateSchema = z.object({
  clubName: z.string().trim().min(1, "Укажите название").max(40, "Название до 40 символов"),
  gradient: z.tuple([hex, hex, hex]),
  logo: image,
  hero: image,
});

interface StoredBranding {
  clubName: string;
  gradient: [string, string, string];
  version: number;
}

/** Таблица settings могла не попасть в базу (P2021) — тогда работаем со стандартным оформлением. */
function isMissingTable(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021";
}

async function readStored(): Promise<StoredBranding | null> {
  try {
    const row = await prisma.settings.findUnique({ where: { key: KEY } });
    if (!row) return null;
    const parsed = JSON.parse(row.value);
    return {
      clubName: typeof parsed.clubName === "string" && parsed.clubName ? parsed.clubName : DEFAULT_BRANDING.clubName,
      gradient: Array.isArray(parsed.gradient) && parsed.gradient.length === 3 ? parsed.gradient : DEFAULT_BRANDING.gradient,
      version: Number(parsed.version) || 0,
    };
  } catch (e) {
    if (isMissingTable(e)) return null;
    throw e;
  }
}

async function hasImage(slot: ImageSlot) {
  try {
    return (await prisma.settings.count({ where: { key: IMAGE_KEYS[slot] } })) > 0;
  } catch (e) {
    if (isMissingTable(e)) return false;
    throw e;
  }
}

export async function getBranding(): Promise<BrandingDTO> {
  const [stored, logo, hero] = await Promise.all([readStored(), hasImage("logo"), hasImage("hero")]);
  const v = stored?.version ?? 0;
  return {
    clubName: stored?.clubName ?? DEFAULT_BRANDING.clubName,
    gradient: stored?.gradient ?? DEFAULT_BRANDING.gradient,
    logoUrl: logo ? `/api/branding/image/logo?v=${v}` : DEFAULT_BRANDING.logoUrl,
    heroImageUrl: hero ? `/api/branding/image/hero?v=${v}` : DEFAULT_BRANDING.heroImageUrl,
    customLogo: logo,
    customHero: hero,
  };
}

export async function getBrandingImage(slot: ImageSlot): Promise<{ mime: string; data: Buffer } | null> {
  try {
    const row = await prisma.settings.findUnique({ where: { key: IMAGE_KEYS[slot] } });
    const match = row?.value.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
    return match ? { mime: match[1], data: Buffer.from(match[2], "base64") } : null;
  } catch (e) {
    if (isMissingTable(e)) return null;
    throw e;
  }
}

async function upsert(tx: Prisma.TransactionClient, key: string, value: string, description: string) {
  await tx.settings.upsert({ where: { key }, create: { key, value, description }, update: { value } });
}

export async function updateBranding(input: z.infer<typeof brandingUpdateSchema>) {
  const current = await readStored();
  const version = (current?.version ?? 0) + 1;
  await prisma.$transaction(async (tx) => {
    await upsert(tx, KEY, JSON.stringify({ clubName: input.clubName, gradient: input.gradient, version }), "Оформление сайта");
    for (const slot of ["logo", "hero"] as const) {
      const value = input[slot];
      if (value === undefined) continue; // не меняли
      if (value === null) await tx.settings.deleteMany({ where: { key: IMAGE_KEYS[slot] } });
      else await upsert(tx, IMAGE_KEYS[slot], value, slot === "logo" ? "Логотип" : "Картинка первого экрана");
    }
  });
  return getBranding();
}
