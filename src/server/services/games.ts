import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { GameDTO } from "@/types/api";

/**
 * Игры клуба для блока «Популярные игры»: список и обложки задаёт администратор.
 * Список — ключ settings "games" (JSON), обложка каждой игры — ключ "games.image.<id>" (data URL).
 * Пока администратор ничего не менял, показывается стандартный список.
 */

const LIST_KEY = "games";
const imageKey = (id: string) => `games.image.${id}`;

interface StoredGame {
  id: string;
  name: string;
  genre: string;
  /** Обложка из /public (стандартный список) — если своей не загружено. */
  staticImage?: string;
  hasImage?: boolean;
  version?: number;
}

const DEFAULT_GAMES: StoredGame[] = [
  { id: "cs2", name: "Counter-Strike 2", genre: "FPS", staticImage: "/Counter-Strike 2 (FPS).jpg" },
  { id: "valorant", name: "Valorant", genre: "FPS", staticImage: "/Valorant.png" },
  { id: "dota2", name: "Dota 2", genre: "MOBA" },
  // Файл называется «Apex Legends.png», но на изображении — обложка League of Legends
  { id: "lol", name: "League of Legends", genre: "MOBA", staticImage: "/Apex Legends.png" },
  { id: "apex", name: "Apex Legends", genre: "Battle Royale" },
  { id: "fortnite", name: "Fortnite", genre: "Battle Royale" },
  { id: "overwatch2", name: "Overwatch 2", genre: "FPS" },
  { id: "cyberpunk", name: "Cyberpunk 2077", genre: "RPG" },
];

const image = z
  .string()
  .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "Обложка: PNG, JPEG или WebP")
  .max(2_800_000, "Обложка слишком большая (до 2 МБ)");

export const gameCreateSchema = z.object({
  name: z.string().trim().min(1, "Укажите название").max(60),
  genre: z.string().trim().max(30).default(""),
  image: image.optional(),
});

export const gameUpdateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  genre: z.string().trim().max(30).optional(),
  /** null — убрать обложку. */
  image: image.nullable().optional(),
});

function isMissingTable(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021";
}

async function readList(db: Prisma.TransactionClient | typeof prisma = prisma): Promise<StoredGame[]> {
  try {
    const row = await db.settings.findUnique({ where: { key: LIST_KEY } });
    if (!row) return DEFAULT_GAMES;
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? parsed : DEFAULT_GAMES;
  } catch (e) {
    if (isMissingTable(e)) return DEFAULT_GAMES;
    throw e;
  }
}

async function writeList(db: Prisma.TransactionClient, list: StoredGame[]) {
  const value = JSON.stringify(list);
  await db.settings.upsert({ where: { key: LIST_KEY }, create: { key: LIST_KEY, value, description: "Игры клуба" }, update: { value } });
}

function toDTO(g: StoredGame): GameDTO {
  return {
    id: g.id,
    name: g.name,
    genre: g.genre,
    imageUrl: g.hasImage ? `/api/branding/image/game-${g.id}?v=${g.version ?? 0}` : g.staticImage ?? null,
  };
}

export async function listGames(): Promise<GameDTO[]> {
  return (await readList()).map(toDTO);
}

export async function getGameImage(id: string): Promise<{ mime: string; data: Buffer } | null> {
  try {
    const row = await prisma.settings.findUnique({ where: { key: imageKey(id) } });
    const match = row?.value.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
    return match ? { mime: match[1], data: Buffer.from(match[2], "base64") } : null;
  } catch (e) {
    if (isMissingTable(e)) return null;
    throw e;
  }
}

async function setImage(db: Prisma.TransactionClient, id: string, value: string | null) {
  if (value === null) await db.settings.deleteMany({ where: { key: imageKey(id) } });
  else await db.settings.upsert({ where: { key: imageKey(id) }, create: { key: imageKey(id), value, description: "Обложка игры" }, update: { value } });
}

export async function createGame(input: z.input<typeof gameCreateSchema>): Promise<GameDTO> {
  return prisma.$transaction(async (tx) => {
    const list = await readList(tx);
    const game: StoredGame = { id: crypto.randomUUID().slice(0, 8), name: input.name, genre: input.genre ?? "", hasImage: !!input.image, version: 1 };
    if (input.image) await setImage(tx, game.id, input.image);
    await writeList(tx, [...list, game]);
    return toDTO(game);
  });
}

export async function updateGame(id: string, input: z.infer<typeof gameUpdateSchema>): Promise<GameDTO | null> {
  return prisma.$transaction(async (tx) => {
    const list = await readList(tx);
    const game = list.find((g) => g.id === id);
    if (!game) return null;
    if (input.name !== undefined) game.name = input.name;
    if (input.genre !== undefined) game.genre = input.genre;
    if (input.image !== undefined) {
      await setImage(tx, id, input.image);
      game.hasImage = input.image !== null;
      if (input.image === null) game.staticImage = undefined; // «убрать обложку» убирает и стандартную
      game.version = (game.version ?? 0) + 1;
    }
    await writeList(tx, list);
    return toDTO(game);
  });
}

export async function deleteGame(id: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const list = await readList(tx);
    if (!list.some((g) => g.id === id)) return false;
    await writeList(tx, list.filter((g) => g.id !== id));
    await setImage(tx, id, null);
    return true;
  });
}
