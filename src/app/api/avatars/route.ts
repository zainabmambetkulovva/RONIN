import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle } from "@/server/http";
import { toAvatarDTO } from "@/server/mappers";

export const dynamic = "force-dynamic";

// GET /api/avatars - аватары, доступные для выбора
export const GET = handle(async () => {
  const avatars = await prisma.avatars.findMany({ where: { is_active: true }, orderBy: { code: "asc" } });
  return NextResponse.json({ avatars: avatars.map(toAvatarDTO) });
});
