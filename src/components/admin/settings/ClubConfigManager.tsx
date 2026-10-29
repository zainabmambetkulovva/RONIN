"use client";

import { ROOM_MAX_PCS } from "@/config/club-layout";
import { useEffect, useState } from "react";
import { Instagram, Monitor, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Button, ErrorNote, Loading } from "@/components/admin/ui";
import { Dropdown } from "@/components/ui/Dropdown";
import { TikTokIcon, WhatsAppIcon } from "@/components/landing/brand-icons";
import { useBranding } from "@/contexts/BrandingContext";

interface Zone {
  label: string;
  count: number;
  columns: number;
  categoryId?: string | null;
}
interface Config {
  socials: { instagram: string; tiktok: string; whatsapp: string };
  zones: Zone[];
}
interface SyncResult {
  total: number;
  inDb: number;
  missing: number[];
  extra: number[];
  created: number;
}

async function call<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Не удалось сохранить");
  return data as T;
}

const range = (nums: number[]) => {
  if (!nums.length) return "";
  const parts: string[] = [];
  let start = nums[0];
  let prev = nums[0];
  for (const n of [...nums.slice(1), Infinity]) {
    if (n !== prev + 1) {
      parts.push(start === prev ? `${start}` : `${start}–${prev}`);
      start = n;
    }
    prev = n;
  }
  return parts.join(", ");
};

/** Соцсети и раскладка зала (количество ПК по зонам) + сверка с компьютерами в базе. */
export function ClubConfigManager() {
  const brand = useBranding();
  const [config, setConfig] = useState<Config | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [sync, setSync] = useState<SyncResult | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const loadSync = () => call<SyncResult>("/api/admin/settings/club/sync").then(setSync).catch(() => undefined);

  useEffect(() => {
    call<{ config: Config }>("/api/admin/settings/club")
      .then(({ config }) => {
        setConfig(config);
        setSaved(JSON.stringify(config));
      })
      .catch((e) => setError(e.message));
    call<{ categories: Array<{ id: string; name: string }> }>("/api/categories")
      .then((d) => setCategories(d.categories))
      .catch(() => undefined);
    loadSync();
  }, []);

  if (!config) return error ? <ErrorNote>{error}</ErrorNote> : <Loading />;

  const dirty = JSON.stringify(config) !== saved;
  const total = config.zones.reduce((s, z) => s + (Number(z.count) || 0), 0);
  const setZone = (i: number, patch: Partial<Zone>) => setConfig({ ...config, zones: config.zones.map((z, k) => (k === i ? { ...z, ...patch } : z)) });

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    setDone(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(null);
    }
  };

  const save = () =>
    run("save", async () => {
      const { config: next } = await call<{ config: Config }>("/api/admin/settings/club", "PUT", config);
      setConfig(next);
      setSaved(JSON.stringify(next));
      setDone("Сохранено.");
      await brand.refresh();
      await loadSync();
    });

  const createMissing = () =>
    run("sync", async () => {
      const result = await call<SyncResult>("/api/admin/settings/club/sync", "POST", { create: true });
      setDone(`Создано компьютеров: ${result.created}`);
      await loadSync();
    });

  let numberFrom = 1;

  return (
    <div className="space-y-6">
      {error && <ErrorNote>{error}</ErrorNote>}
      {done && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{done}</p>}

      {/* Соцсети */}
      <div>
        <p className="mb-3 text-sm font-semibold text-white">Соцсети</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["instagram", "Instagram", <Instagram key="i" className="h-4 w-4" />],
              ["tiktok", "TikTok", <TikTokIcon key="t" className="h-4 w-4" />],
              ["whatsapp", "WhatsApp", <WhatsAppIcon key="w" className="h-4 w-4" />],
            ] as const
          ).map(([key, label, icon]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1.5 flex items-center gap-1.5 text-rn-muted">
                {icon} {label}
              </span>
              <input
                value={config.socials[key]}
                onChange={(e) => setConfig({ ...config, socials: { ...config.socials, [key]: e.target.value } })}
                placeholder="https://… (пусто — скрыть)"
                className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-white outline-none focus:border-rn-violet"
              />
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-rn-muted">Для WhatsApp: https://wa.me/996XXXXXXXXX</p>
      </div>

      {/* Зоны зала */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Компьютеры по залам · всего {total}</p>
          <button
            type="button"
            onClick={() => setConfig({ ...config, zones: [...config.zones, { label: `ЗАЛ ${config.zones.length + 1}`, count: 10, columns: 5, categoryId: null }] })}
            className="flex items-center gap-1 text-xs font-semibold text-rn-cyan hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Зона
          </button>
        </div>
        <p className="mb-3 text-xs text-rn-muted">
          3D-карта строится по компьютерам из раздела «Компьютеры»: залы — это категории ПК, залы со словом ROOM / «комнаты» в названии (или до {ROOM_MAX_PCS} ПК)
          показываются отдельными комнатами. Зоны ниже нужны, чтобы создать недостающие ПК для нового клуба.
        </p>
        <ul className="space-y-2">
          {config.zones.map((z, i) => {
            const from = numberFrom;
            numberFrom += Number(z.count) || 0;
            return (
              <li key={i} className="grid grid-cols-2 items-end gap-2 rounded-xl border border-rn-line/70 bg-rn-night/50 p-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr_1.2fr_auto]">
                <label className="col-span-2 text-xs sm:col-span-1">
                  <span className="mb-1 block text-rn-muted">Название</span>
                  <input value={z.label} maxLength={24} onChange={(e) => setZone(i, { label: e.target.value })} className="w-full rounded-lg border border-rn-line bg-rn-night px-2.5 py-1.5 text-sm text-white outline-none focus:border-rn-violet" />
                </label>
                <label className="text-xs">
                  <span className="mb-1 block text-rn-muted">ПК</span>
                  <input type="number" min={1} max={200} value={z.count} onChange={(e) => setZone(i, { count: Number(e.target.value) })} className="w-full rounded-lg border border-rn-line bg-rn-night px-2.5 py-1.5 text-sm text-white outline-none focus:border-rn-violet" />
                </label>
                <label className="text-xs">
                  <span className="mb-1 block text-rn-muted">В ряду</span>
                  <input type="number" min={1} max={20} value={z.columns} onChange={(e) => setZone(i, { columns: Number(e.target.value) })} className="w-full rounded-lg border border-rn-line bg-rn-night px-2.5 py-1.5 text-sm text-white outline-none focus:border-rn-violet" />
                </label>
                <div className="col-span-2 text-xs sm:col-span-1">
                  <span className="mb-1 block text-rn-muted">Тарифный зал для новых ПК</span>
                  <Dropdown
                    label="Тарифный зал"
                    value={z.categoryId ?? ""}
                    onChange={(v) => setZone(i, { categoryId: v || null })}
                    options={[{ value: "", label: "Первый по алфавиту" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                  <span className="text-[11px] text-rn-muted">
                    № {from}–{from + (Number(z.count) || 0) - 1}
                  </span>
                  <button
                    type="button"
                    disabled={config.zones.length === 1}
                    onClick={() => setConfig({ ...config, zones: config.zones.filter((_, k) => k !== i) })}
                    className="rounded-lg border border-rose-500/30 p-1.5 text-rose-300 hover:bg-rose-500/10 disabled:opacity-30"
                    aria-label="Удалить зону"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={save} loading={busy === "save"} disabled={!dirty}>
          <Save className="h-4 w-4" /> Сохранить
        </Button>
        {dirty && <span className="text-xs text-amber-300">Есть несохранённые изменения</span>}
      </div>

      {/* Сверка с базой */}
      {sync && (
        <div className="rounded-xl border border-rn-line/70 bg-rn-night/50 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-white">
            <Monitor className="h-4 w-4 text-rn-purple" /> На схеме {sync.total} ПК, в базе {sync.inDb}
          </p>
          {sync.missing.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-amber-300">Нет в базе: № {range(sync.missing)}</span>
              <Button onClick={createMissing} loading={busy === "sync"}>
                <Plus className="h-4 w-4" /> Создать недостающие
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-emerald-300">Все ПК со схемы есть в базе</p>
          )}
          {sync.extra.length > 0 && (
            <p className="mt-2 text-xs text-rn-muted">
              В базе есть ПК с номерами вне схемы (№ {range(sync.extra)}) — на карте их не видно. Удалить или изменить их можно в разделе «Компьютеры».
            </p>
          )}
          <button type="button" onClick={loadSync} className="mt-2 flex items-center gap-1 text-xs text-rn-cyan hover:text-white">
            <RefreshCw className="h-3 w-3" /> Проверить снова
          </button>
        </div>
      )}
    </div>
  );
}
