import { NextResponse } from "next/server";
import { z } from "zod";
import { handle, parseJson } from "@/server/http";
import { createUserSession, requireUser } from "@/server/auth/session";
import { toCurrentUserDTO } from "@/server/mappers";
import { updateOwnProfile } from "@/server/services/users";

const schema = z.object({ avatarCode: z.string().trim().min(1, "Avatar code is required").max(50) });

// PATCH /api/user/avatar - обновить аватар пользователя
export const PATCH = handle(async (req) => {
  const user = await requireUser();
  const { avatarCode } = await parseJson(req, schema);
  const updated = await updateOwnProfile(user.id, { avatar: avatarCode });
  await createUserSession(updated);
  return NextResponse.json({ success: true, user: toCurrentUserDTO(updated) });
});
