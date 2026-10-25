import { NextResponse } from "next/server";
import { handle, notFound, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { deleteGame, gameUpdateSchema, updateGame } from "@/server/services/games";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// PATCH /api/admin/settings/games/[id] — название, жанр, обложка
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, gameUpdateSchema);
  const game = await updateGame(params.id, input);
  if (!game) throw notFound("Игра не найдена");
  await writeAuditLog({
    userId: admin.id,
    action: "UPDATE_GAME",
    entityType: "Settings",
    entityId: game.id,
    newData: { name: game.name, genre: game.genre, image: input.image === undefined ? "unchanged" : input.image === null ? "removed" : "uploaded" },
  });
  return NextResponse.json({ game });
});

// DELETE /api/admin/settings/games/[id]
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  if (!(await deleteGame(params.id))) throw notFound("Игра не найдена");
  await writeAuditLog({ userId: admin.id, action: "DELETE_GAME", entityType: "Settings", entityId: params.id });
  return NextResponse.json({ success: true });
});
