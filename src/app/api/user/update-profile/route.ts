import { NextResponse } from "next/server";
import { z } from "zod";
import { handle, parseJson } from "@/server/http";
import { createUserSession, requireUser } from "@/server/auth/session";
import { toCurrentUserDTO } from "@/server/mappers";
import { profileUpdateSchema, updateOwnProfile } from "@/server/services/users";

// Используется страницей setup-profile: имя обязательно
const setupSchema = profileUpdateSchema.extend({
  name: z.string({ required_error: "Имя обязательно" }).trim().min(1, "Имя обязательно").max(100),
});

// POST /api/user/update-profile - первичная настройка профиля
export const POST = handle(async (req) => {
  const user = await requireUser();
  const input = await parseJson(req, setupSchema);
  const updated = await updateOwnProfile(user.id, input);
  await createUserSession(updated);
  return NextResponse.json({ success: true, user: toCurrentUserDTO(updated) });
});
