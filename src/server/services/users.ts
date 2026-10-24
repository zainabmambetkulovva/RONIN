import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict } from "@/server/http";

/** Поля профиля, которые пользователь может менять сам. Роль, статус, email — нет. */
export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, "Имя обязательно").max(100, "Имя слишком длинное").optional(),
  phone: z
    .string()
    .trim()
    .max(20, "Телефон слишком длинный")
    .regex(/^\+?[0-9\s()-]*$/, "Некорректный номер телефона")
    .optional()
    .or(z.literal("")),
  avatar: z.string().trim().max(50).optional().or(z.literal("")),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export async function updateOwnProfile(userId: string, input: ProfileUpdate) {
  const data: { name?: string; phone?: string | null; avatar?: string | null; updated_at: Date } = {
    updated_at: new Date(),
  };

  if (input.name !== undefined) data.name = input.name;

  if (input.phone !== undefined) {
    const phone = input.phone || null;
    if (phone) {
      const taken = await prisma.users.findFirst({ where: { phone, id: { not: userId } }, select: { id: true } });
      if (taken) throw conflict("Этот номер телефона уже используется");
    }
    data.phone = phone;
  }

  if (input.avatar !== undefined) {
    const avatar = input.avatar || null;
    // Допустимо: "default", код из таблицы avatars или локальный файл из /avatars/ (страница setup-profile)
    const isLocalAvatarFile = avatar ? /^\/avatars\/[\w.-]+\.(png|jpe?g|webp|svg)$/i.test(avatar) : false;
    if (avatar && avatar !== "default" && !isLocalAvatarFile) {
      const exists = await prisma.avatars.findFirst({ where: { code: avatar, is_active: true }, select: { id: true } });
      if (!exists) throw badRequest("Такой аватар недоступен");
    }
    data.avatar = avatar;
  }

  return prisma.users.update({ where: { id: userId }, data });
}
