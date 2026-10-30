import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/og — картинка-превью 1200×630 для соцсетей и мессенджеров (Open Graph, Twitter Card).
 * Название, цвета и логотип берутся из настроек бренда, поэтому подходит любому клубу.
 * Шрифты с кириллицей лежат в проекте (встроенный шрифт генератора знает только латиницу).
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const [display, body, branding] = await Promise.all([
    fetch(new URL("../../../assets/og/Unbounded-ExtraBold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../../assets/og/Inter-Medium.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(`${origin}/api/branding`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.branding ?? null)
      .catch(() => null),
  ]);

  // Реальные цифры для превью: число ПК и самая низкая цена за час. Если API не ответил — блок просто не показываем
  const [pcCount, minHourly] = await Promise.all([
    fetch(`${origin}/api/computers`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (typeof d?.total === "number" && d.total > 0 ? (d.total as number) : null))
      .catch(() => null),
    fetch(`${origin}/api/tariffs`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const prices: number[] = (d?.tariffs ?? []).filter((t: { type: string }) => t.type === "hourly").map((t: { price: number }) => t.price);
        return prices.length ? Math.min(...prices) : null;
      })
      .catch(() => null),
  ]);

  const name: string = branding?.clubName ?? "RONIN";
  const [c1, c2, c3]: string[] = branding?.gradient ?? ["#e9d5ff", "#d946ef", "#22d3ee"];
  // Генератор понимает PNG/JPEG; картинку в другом формате (WebP) не показываем, чтобы превью не сломалось
  const loadImage = (url: string) =>
    fetch(url)
      .then(async (r) => {
        const type = r.headers.get("content-type") ?? "";
        if (!r.ok || !/image\/(png|jpeg)/.test(type)) return null;
        const bytes = new Uint8Array(await r.arrayBuffer());
        let bin = "";
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
        return `data:${type.split(";")[0]};base64,${btoa(bin)}`;
      })
      .catch(() => null);
  const heroPath = branding?.heroImageUrl ?? "/brand/samurai.png";
  const [logo, hero] = await Promise.all([
    loadImage(`${origin}${branding?.logoUrl ?? "/logo-new.png"}`),
    // Персонаж с главной: уменьшенная копия через оптимизатор Next (оригинал весит ~1,6 МБ), если не вышло — оригинал
    loadImage(`${origin}/_next/image?url=${encodeURIComponent(heroPath)}&w=640&q=80`).then((img) => img ?? loadImage(`${origin}${heroPath}`)),
  ]);
  const host = new URL(origin).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #07061a 0%, #120d33 55%, #1b0f3d 100%)",
          color: "#fff",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Неоновые пятна */}
        <div style={{ position: "absolute", top: -160, right: -120, width: 520, height: 520, borderRadius: 9999, background: c2, opacity: 0.28, filter: "blur(90px)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -200, left: -140, width: 560, height: 560, borderRadius: 9999, background: c3, opacity: 0.2, filter: "blur(100px)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={120} height={120} alt="" style={{ objectFit: "contain" }} />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Unbounded",
                fontSize: name.length > 10 ? 72 : 96,
                letterSpacing: 6,
                lineHeight: 1,
                backgroundImage: `linear-gradient(90deg, ${c1}, ${c2}, ${c3})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {name.toUpperCase()}
            </div>
            <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 14 }}>Компьютерный клуб · Бишкек</div>
          </div>
        </div>

        {/* Персонаж справа на фоне неонового свечения */}
        {/* Свечение — радиальный градиент: размытие (blur) обрезалось бы по краям блока прямой линией */}
        {hero && (
          <div style={{ position: "absolute", right: -160, top: -40, width: 800, height: 800, display: "flex", backgroundImage: `radial-gradient(circle, ${c2}66 0%, ${c2}22 35%, transparent 65%)` }} />
        )}
        {hero && (
          <div style={{ position: "absolute", right: 10, bottom: -70, width: 470, height: 705, display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} width={470} height={705} alt="" style={{ objectFit: "contain" }} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: 700 }}>
          {/* Цифры из базы: число ПК, цена за час, круглосуточно */}
          <div style={{ display: "flex", gap: 44 }}>
            {[
              pcCount ? { value: String(pcCount), label: "игровых ПК" } : null,
              minHourly ? { value: `от ${minHourly}`, label: "сом за час" } : null,
              { value: "24/7", label: "без выходных" },
            ]
              .filter((x): x is { value: string; label: string } => Boolean(x))
              .map((x) => (
                <div key={x.label} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: "Unbounded", fontSize: 54, lineHeight: 1.05, color: "#fff" }}>{x.value}</div>
                  <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{x.label}</div>
                </div>
              ))}
          </div>
          {/* Призыв и адрес сайта */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                padding: "16px 34px",
                borderRadius: 9999,
                backgroundImage: `linear-gradient(90deg, ${c2}, #7c3aed)`,
                fontFamily: "Unbounded",
                fontSize: 26,
                color: "#fff",
              }}
            >
              Забронируй онлайн
            </div>
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{host}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Unbounded", data: display, weight: 800, style: "normal" },
        { name: "Inter", data: body, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
    }
  );
}
