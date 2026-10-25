import { NextResponse } from "next/server";
import { handle, notFound } from "@/server/http";
import { DEFAULT_BRANDING, getBrandingImage, type ImageSlot } from "@/server/services/branding";
import { getGameImage } from "@/server/services/games";

export const dynamic = "force-dynamic";

// GET /api/branding/image/logo|hero|game-<id>?v=N — загруженная в админке картинка (адрес меняется при каждом сохранении)
export const GET = handle<{ slot: string }>(async (req, { params }) => {
  const game = params.slot.match(/^game-([A-Za-z0-9-]{1,40})$/);
  if (game) {
    const cover = await getGameImage(game[1]);
    if (!cover) throw notFound();
    return new NextResponse(new Uint8Array(cover.data), {
      headers: { "Content-Type": cover.mime, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }
  if (params.slot !== "logo" && params.slot !== "hero") throw notFound();
  const slot = params.slot as ImageSlot;
  const image = await getBrandingImage(slot);
  if (!image) {
    const fallback = slot === "logo" ? DEFAULT_BRANDING.logoUrl : DEFAULT_BRANDING.heroImageUrl;
    return NextResponse.redirect(new URL(fallback, req.url));
  }
  return new NextResponse(new Uint8Array(image.data), {
    headers: { "Content-Type": image.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
});
