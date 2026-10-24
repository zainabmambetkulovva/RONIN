import { NextResponse } from "next/server";
import { handle, parseJson } from "@/server/http";
import { createUserSession, requireUser } from "@/server/auth/session";
import { toCurrentUserDTO } from "@/server/mappers";
import { profileUpdateSchema, updateOwnProfile } from "@/server/services/users";

export const dynamic = "force-dynamic";

// GET /api/user/profile - профиль текущего пользователя
export const GET = handle(async () => {
  const user = await requireUser();
  return NextResponse.json({ user: toCurrentUserDTO(user) });
});

// PATCH /api/user/profile - обновить имя, телефон, аватар
export const PATCH = handle(async (req) => {
  const user = await requireUser();
  const input = await parseJson(req, profileUpdateSchema);
  const updated = await updateOwnProfile(user.id, input);
  // Перевыпускаем сессию: флаг needsSetup мог измениться
  await createUserSession(updated);
  return NextResponse.json({ success: true, user: toCurrentUserDTO(updated) });
});
