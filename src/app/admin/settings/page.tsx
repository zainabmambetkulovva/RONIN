"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlus, Palette, RotateCcw, Save, Tags, Type } from "lucide-react";
import { ApiClientError } from "@/lib/api-client";
import { DEFAULT_BRANDING, useBranding } from "@/contexts/BrandingContext";
import { Button, ErrorNote, Loading, PageHeader } from "@/components/admin/ui";
import type { BrandingDTO } from "@/types/api";

/** Готовые сочетания цветов градиента. */
const PRESETS: Array<{ name: string; colors: [string, string, string] }> = [
  { name: "Неон (стандарт)", colors: ["#e9d5ff", "#d946ef", "#22d3ee"] },
  { name: "Огонь", colors: ["#fde68a", "#f97316", "#ef4444"] },
  { name: "Океан", colors: ["#bae6fd", "#3b82f6", "#06b6d4"] },
  { name: "Токсик", colors: ["#d9f99d", "#22c55e", "#14b8a6"] },
  { name: "Закат", colors: ["#fbcfe8", "#ec4899", "#f59e0b"] },
];

type ImageChange = string | null | undefined; // строка — новая картинка, null — вернуть стандартную, undefined — без изменений

/** Уменьшает картинку в браузере (сохраняя прозрачность) и отдаёт data URL WebP. */
async function resizeImage(file: File, maxSide: number): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error("Подходят PNG, JPEG или WebP");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Не удалось прочитать картинку"));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.9);
    if (data.length > 2_700_000) throw new Error("Картинка слишком большая даже после сжатия — выберите поменьше");
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function SettingsPage() {
  const brand = useBranding();
  const [loaded, setLoaded] = useState<BrandingDTO | null>(null);
  const [clubName, setClubName] = useState("");
  const [gradient, setGradient] = useState<[string, string, string]>(DEFAULT_BRANDING.gradient);
  const [logo, setLogo] = useState<ImageChange>(undefined);
  const [hero, setHero] = useState<ImageChange>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/branding", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Не удалось загрузить настройки"))))
      .then(({ branding }: { branding: BrandingDTO }) => {
        setLoaded(branding);
        setClubName(branding.clubName);
        setGradient(branding.gradient);
      })
      .catch((e) => setError(e.message));
  }, []);

  const logoPreview = logo === null ? DEFAULT_BRANDING.logoUrl : logo ?? loaded?.logoUrl ?? DEFAULT_BRANDING.logoUrl;
  const heroPreview = hero === null ? DEFAULT_BRANDING.heroImageUrl : hero ?? loaded?.heroImageUrl ?? DEFAULT_BRANDING.heroImageUrl;
  const dirty =
    !!loaded && (clubName !== loaded.clubName || gradient.join() !== loaded.gradient.join() || logo !== undefined || hero !== undefined);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubName, gradient, ...(logo !== undefined && { logo }), ...(hero !== undefined && { hero }) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiClientError(res.status, data?.error || "Не удалось сохранить", data?.code || "error");
      setLoaded(data.branding);
      setLogo(undefined);
      setHero(undefined);
      setSaved(true);
      await brand.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded && !error) return <Loading />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Настройки"
        subtitle="Оформление сайта клуба. Изменения сразу видят все посетители."
        actions={
          <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>
            <Save className="h-4 w-4" /> Сохранить
          </Button>
        }
      />

      {error && <ErrorNote>{error}</ErrorNote>}
      {saved && !dirty && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">Сохранено. Сайт обновлён.</p>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          {/* Название и логотип */}
          <Section icon={<Type className="h-5 w-5" />} title="Название и логотип">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <label className="block text-sm">
                <span className="mb-1.5 block text-rn-muted">Название клуба</span>
                <input
                  value={clubName}
                  maxLength={40}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2.5 text-white outline-none focus:border-rn-violet"
                />
                <span className="mt-1.5 block text-xs text-rn-muted">Показывается в шапке, на первом экране, в подвале и в админке.</span>
              </label>
              <ImagePicker label="Логотип" preview={logoPreview} maxSide={512} square onPick={setLogo} onError={setError} canReset={loaded?.customLogo || !!logo} onReset={() => setLogo(null)} />
            </div>
          </Section>

          {/* Картинка первого экрана */}
          <Section icon={<ImagePlus className="h-5 w-5" />} title="Картинка первого экрана">
            <p className="mb-4 text-sm text-rn-muted">Персонаж справа от заголовка (сейчас — самурай). Лучше всего PNG с прозрачным фоном, вертикальная.</p>
            <ImagePicker label="Картинка" preview={heroPreview} maxSide={1400} onPick={setHero} onError={setError} canReset={loaded?.customHero || !!hero} onReset={() => setHero(null)} />
          </Section>

          {/* Цвета */}
          <Section icon={<Palette className="h-5 w-5" />} title="Цвета градиента">
            <div className="mb-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setGradient(p.colors)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                    gradient.join() === p.colors.join() ? "border-rn-violet bg-rn-violet/15 text-white" : "border-rn-line text-rn-muted hover:text-white"
                  }`}
                >
                  <span className="h-3 w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${p.colors.join(",")})` }} />
                  {p.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gradient.map((c, i) => (
                <label key={i} className="block text-sm">
                  <span className="mb-1.5 block text-rn-muted">Цвет {i + 1}</span>
                  <span className="flex items-center gap-2 rounded-xl border border-rn-line bg-rn-night p-1.5 pr-3">
                    <input
                      type="color"
                      value={c}
                      onChange={(e) => setGradient((g) => g.map((x, j) => (j === i ? e.target.value : x)) as [string, string, string])}
                      className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                      aria-label={`Цвет ${i + 1}`}
                    />
                    <span className="font-mono text-xs uppercase text-white/80">{c}</span>
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Тарифы */}
          <Section icon={<Tags className="h-5 w-5" />} title="Тарифы">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-rn-muted">Добавляйте, меняйте и удаляйте тарифы. Цена уже созданных броней не меняется.</p>
              <Link href="/admin/tariffs" className="rounded-xl border border-rn-line px-4 py-2 text-sm text-white transition hover:border-rn-violet">
                Открыть тарифы →
              </Link>
            </div>
          </Section>
        </div>

        {/* Предпросмотр */}
        <aside className="min-w-0">
          <div className="sticky top-24 rounded-2xl border border-rn-line/80 bg-rn-surface/70 p-5">
            <h2 className="mb-4 text-base font-semibold text-white">Предпросмотр</h2>
            <div className="relative overflow-hidden rounded-xl border border-rn-line bg-rn-void p-5">
              <div className="flex items-center gap-2">
                <span className="relative h-7 w-7">
                  <Image src={logoPreview} alt="" fill sizes="28px" unoptimized className="object-contain" />
                </span>
                <span className="font-display text-sm font-black tracking-[0.18em] text-white">{clubName || "—"}</span>
              </div>
              <div className="mt-5 grid grid-cols-[1fr_90px] items-end gap-2">
                <div className="min-w-0">
                  <p
                    className="break-words font-display text-4xl font-black uppercase leading-none"
                    style={{ background: `linear-gradient(100deg, #fff 0%, ${gradient[0]} 35%, ${gradient[1]} 65%, ${gradient[2]} 100%)`, WebkitBackgroundClip: "text", color: "transparent" }}
                  >
                    {clubName || "—"}
                  </p>
                  <span className="mt-4 inline-block rounded-xl px-4 py-2 font-display text-[10px] font-bold uppercase tracking-widest text-white" style={{ background: `linear-gradient(90deg, ${gradient[1]}, ${gradient[2]})` }}>
                    Забронировать
                  </span>
                </div>
                <span className="relative block aspect-[4/5]">
                  <Image src={heroPreview} alt="" fill sizes="90px" unoptimized className="object-contain object-bottom" />
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-rn-muted">Нажмите «Сохранить», чтобы применить на сайте.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-rn-line/80 bg-rn-surface/70 p-5">
      <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rn-violet/20 text-rn-purple">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ImagePicker({
  label,
  preview,
  maxSide,
  square,
  onPick,
  onError,
  canReset,
  onReset,
}: {
  label: string;
  preview: string;
  maxSide: number;
  square?: boolean;
  onPick: (data: string) => void;
  onError: (message: string | null) => void;
  canReset?: boolean;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-4">
      <span className={`relative shrink-0 overflow-hidden rounded-xl border border-rn-line bg-rn-night ${square ? "h-20 w-20" : "h-32 w-28"}`}>
        <Image src={preview} alt={label} fill sizes="112px" unoptimized className="object-contain p-1.5" />
      </span>
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              onError(null);
              onPick(await resizeImage(file, maxSide));
            } catch (err) {
              onError(err instanceof Error ? err.message : "Не удалось загрузить картинку");
            }
          }}
        />
        <Button onClick={() => inputRef.current?.click()}>
          <ImagePlus className="h-4 w-4" /> Загрузить
        </Button>
        {canReset && (
          <button type="button" onClick={onReset} className="flex items-center gap-1.5 text-xs text-rn-muted hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" /> Стандартная
          </button>
        )}
      </div>
    </div>
  );
}
