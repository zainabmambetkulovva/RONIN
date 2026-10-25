"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Loading } from "@/components/admin/ui";

interface Check {
  key: string;
  label: string;
  ok: boolean;
  message: string;
  fix: string;
}

/** Проверка подключений сайта: ИИ, Google, Finik, Telegram и т. д. Ключи не показываются — только «есть / нет». */
export function HealthPanel() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings/health", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Не удалось проверить");
      setChecks(data.checks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!checks && !error) return <Loading />;

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {checks?.map((c) => (
        <div key={c.key} className="rounded-xl border border-rn-line/70 bg-rn-night/50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            {c.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
            {c.label}
            <span className={`ml-auto text-xs font-normal ${c.ok ? "text-emerald-300" : "text-rose-300"}`}>{c.message}</span>
          </p>
          {!c.ok && <p className="mt-1.5 break-words text-xs text-rn-muted">Как исправить: {c.fix}</p>}
          {c.ok && c.key === "google" && <p className="mt-1.5 break-words text-xs text-rn-muted">Проверьте, что в Google добавлен адрес: {c.fix.split(": ").pop()}</p>}
        </div>
      ))}
      <button type="button" onClick={load} disabled={loading} className="flex items-center gap-1 text-xs text-rn-cyan hover:text-white disabled:opacity-50">
        <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Проверить снова
      </button>
    </div>
  );
}
