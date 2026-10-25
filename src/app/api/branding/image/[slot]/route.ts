import { NextResponse } from "next/server";
import { handle, notFound } from "@/server/http";
import { DEFAULT_BRANDING, getBrandingImage, type ImageSlot } from "@/server/services/branding";

export const dynamic = "force-dynamic";

// GET /api/branding/image/logo|hero?v=N — загруженная в админке картинка (адрес меняется при каждом сохранении)
export const GET = handle<{ slot: string }>(async (req, { params }) => {
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
