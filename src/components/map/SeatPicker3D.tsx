"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, LayoutGrid, Loader2 } from "lucide-react";
import { CLUB_LAYOUT } from "@/config/club-layout";
import { SeatGrid } from "@/components/cabinet/SeatGrid";
import type { ComputerDTO } from "@/types/api";
import type { SeatView } from "./ClubMap3D";

const ClubMap3D = dynamic(() => import("./ClubMap3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-rn-muted">
      <Loader2 className="h-5 w-5 animate-spin" /> Загружаем 3D-зал…
    </div>
  ),
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Выбор места при бронировании: 3D-зал (зелёный — свободен на выбранное время, красный — занят,
 * тёмный — другой зал) или привычная сетка номеров.
 */
export function SeatPicker3D({
  computers,
  selectedId,
  onSelect,
}: {
  computers: ComputerDTO[];
  selectedId: string | null;
  onSelect: (computer: ComputerDTO) => void;
}) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [view, setView] = useState<"3d" | "grid">("3d");
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const ok = hasWebGL();
    setWebgl(ok);
    if (!ok) setView("grid");
  }, []);

  const byNumber = useMemo(() => new Map(computers.map((c) => [c.number, c])), [computers]);
  const seats: SeatView[] = useMemo(
    () =>
      CLUB_LAYOUT.slots.map((s) => {
        const c = byNumber.get(s.number);
        if (!c) return { number: s.number, state: "unknown" as const };
        if (c.status === "maintenance") return { number: s.number, state: "maintenance" as const };
        return { number: s.number, state: c.availableForSlot === false ? ("busy" as const) : ("free" as const) };
      }),
    [byNumber]
  );
  const selectedNumber = computers.find((c) => c.id === selectedId)?.number ?? null;

  const pick = (number: number) => {
    const c = byNumber.get(number);
    if (!c) return setHint(`ПК № ${number} — в другом зале. Выберите этот зал выше.`);
    if (c.status === "maintenance") return setHint(`ПК № ${number} на обслуживании.`);
    if (c.availableForSlot === false) return setHint(`ПК № ${number} занят в это время — выберите другой или другое время.`);
    setHint(null);
    onSelect(c);
  };

  return (
    <div>
      {webgl && (
        <div className="mb-3 flex rounded-xl border border-rn-line p-0.5 text-sm" role="tablist" aria-label="Вид">
          <button role="tab" aria-selected={view === "3d"} onClick={() => setView("3d")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 ${view === "3d" ? "bg-rn-violet/30 text-white" : "text-rn-muted"}`}>
            <Box className="h-4 w-4" /> 3D-зал
          </button>
          <button role="tab" aria-selected={view === "grid"} onClick={() => setView("grid")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 ${view === "grid" ? "bg-rn-violet/30 text-white" : "text-rn-muted"}`}>
            <LayoutGrid className="h-4 w-4" /> Список
          </button>
        </div>
      )}

      {view === "3d" && webgl ? (
        <>
          <div className="relative h-[60vh] max-h-[520px] min-h-[340px] overflow-hidden rounded-2xl border border-rn-line bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)]">
            <ClubMap3D seats={seats} selected={selectedNumber} onSelect={pick} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-rn-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Свободен</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Занят</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />Другой зал</span>
            <span>· нажмите на ПК, вращайте и приближайте пальцем</span>
          </div>
          {hint && <p className="mt-2 text-sm text-amber-300">{hint}</p>}
        </>
      ) : (
        webgl !== null && <SeatGrid computers={computers} selectedId={selectedId} onSelect={onSelect} />
      )}
    </div>
  );
}
