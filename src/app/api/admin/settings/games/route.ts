import { NextResponse } from "next/server";
import { handle, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth/staff";
import { createGame, gameCreateSchema, listGames } from "@/server/services/games";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/settings/games
export const GET = handle(async (req) => {
  await requireAdmin(req);
  return NextResponse.json({ games: await listGames() });
});

// POST /api/admin/settings/games — добавить игру (с обложкой или без)
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, gameCreateSchema);
  const game = await createGame(input);
  await writeAuditLog({ userId: admin.id, action: "CREATE_GAME", entityType: "Settings", entityId: game.id, newData: { name: game.name, genre: game.genre } });
  return NextResponse.json({ game }, { status: 201 });
});
