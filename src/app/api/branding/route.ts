import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { getBranding } from "@/server/services/branding";

export const dynamic = "force-dynamic";

// GET /api/branding — публичное оформление сайта (название, логотип, картинка, цвета)
export const GET = handle(async () => {
  const branding = await getBranding();
  return NextResponse.json({ branding }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } });
});
