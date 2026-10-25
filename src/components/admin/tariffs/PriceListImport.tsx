"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";

interface PlanTariff {
  name: string;
  durationMinutes: number;
  price: number;
  action: "create" | "update" | "unchanged";
  oldPrice?: number;
}

interface Plan {
  categories: Array<{
    name: string;
    action: "create" | "existing";
    matchedName: string | null;
    rename: boolean;
    tariffs: PlanTariff[];
    extraActiveTariffs: Array<{ id: string; name: string; price: number }>;
  }>;
}

const ACTION_LABEL: Record<PlanTariff["action"], string> = {
  create: "будет создан",
  update: "будет обновлён",
  unchanged: "без изменений",
};

/** Кнопка «Загрузить прайс RONIN»: предпросмотр изменений и применение. */
export function PriceListImport({ onApplied }: { onApplied: () => void }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const openPreview = async () => {
    setOpen(true);
    setDone(false);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/price-list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось получить предпросмотр");
      setPlan(data.plan);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const apply = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/price-list", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось загрузить прайс");
      setPlan(data.plan);
      setDone(true);
      onApplied();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const changes = plan?.categories.reduce(
    (n, c) => n + (c.action === "create" || c.rename ? 1 : 0) + c.tariffs.filter((t) => t.action !== "unchanged").length,
    0
  );

  return (
    <>
      <button
        onClick={openPreview}
        className="flex items-center gap-2 rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-purple-500/10"
      >
        <Download className="h-5 w-5" />
        Загрузить прайс RONIN
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#0f0b1e] p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase text-white">Прайс RONIN</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Comfort, Premium и Ronin Rooms — 1 ч, 3 ч, 5 ч, ночь, утро. Цены уже созданных броней не меняются.
                  После загрузки тарифы можно редактировать и удалять как обычно.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white" aria-label="Закрыть">
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading && <p className="py-6 text-center text-gray-400">Загрузка…</p>}
            {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            {done && <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">Прайс загружен.</p>}

            {plan && !loading && (
              <div className="space-y-4">
                {plan.categories.map((c) => (
                  <div key={c.name} className="rounded-xl border border-white/10 p-4">
                    <div className="mb-2 font-bold text-white">
                      {c.name}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        {c.action === "create"
                          ? "· категория будет создана"
                          : `· категория «${c.matchedName}»${c.rename ? `, будет переименована в «${c.name}»` : ""}`}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {c.tariffs.map((t) => (
                        <li key={t.name} className="flex justify-between gap-3">
                          <span className="text-gray-200">
                            {t.name} · {t.durationMinutes} мин
                          </span>
                          <span className={t.action === "unchanged" ? "text-gray-500" : "text-purple-300"}>
                            {t.price} сом
                            {t.oldPrice !== undefined && t.oldPrice !== t.price ? ` (было ${t.oldPrice})` : ""} — {ACTION_LABEL[t.action]}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {c.extraActiveTariffs.length > 0 && (
                      <p className="mt-2 text-xs text-amber-300/80">
                        Не входят в прайс и не изменяются (можно отключить вручную):{" "}
                        {c.extraActiveTariffs.map((e) => `${e.name} (${e.price} сом)`).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  Длительность «Ночь пакет» (600 мин) и «Утро пакет» (240 мин) взята с прежнего сайта — проверьте и при
                  необходимости измените после загрузки.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white">
                {done ? "Готово" : "Отмена"}
              </button>
              {!done && (
                <button
                  onClick={apply}
                  disabled={loading || !plan || changes === 0}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-40"
                >
                  {changes === 0 ? "Всё актуально" : `Применить (${changes ?? 0})`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
