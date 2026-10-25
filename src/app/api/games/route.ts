import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { listGames } from "@/server/services/games";

export const dynamic = "force-dynamic";

// GET /api/games — публичный список игр клуба
export const GET = handle(async () => {
  return NextResponse.json({ games: await listGames() }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } });
});
