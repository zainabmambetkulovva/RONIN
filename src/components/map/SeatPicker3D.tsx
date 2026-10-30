"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, LayoutGrid, Loader2 } from "lucide-react";
import { useClubLayout } from "./useClubLayout";
import { SeatGrid } from "@/components/cabinet/SeatGrid";
import type { ComputerDTO } from "@/types/api";
import type { SeatView } from "./ClubMap3D";
import { useLanguage } from "@/contexts/LanguageContext";

const ClubMap3D = dynamic(() => import("./ClubMap3D"), {
  ssr: false,
  loading: () => <Loading3D />,
});

function Loading3D() {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-rn-muted">
      <Loader2 className="h-5 w-5 animate-spin" /> {t("map.loading3d")}
    </div>
  );
}

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
  groupByHall = false,
  layoutComputers,
}: {
  computers: ComputerDTO[];
  selectedId: string | null;
  onSelect: (computer: ComputerDTO) => void;
  /** Список — отдельной сеткой на каждый зал (бронь в админке, где видны все залы). */
  groupByHall?: boolean;
  /** Все ПК клуба для схемы (если computers — только один зал). */
  layoutComputers?: ComputerDTO[] | null;
}) {
  const { t } = useLanguage();
  const CLUB_LAYOUT = useClubLayout(layoutComputers?.length ? layoutComputers : computers);
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
    [byNumber, CLUB_LAYOUT]
  );
  const selectedNumber = computers.find((c) => c.id === selectedId)?.number ?? null;

  const pick = (number: number) => {
    const c = byNumber.get(number);
    if (!c) return setHint(t("map.hintOther").replace("{n}", String(number)));
    if (c.status === "maintenance") return setHint(t("map.hintService").replace("{n}", String(number)));
    if (c.availableForSlot === false) return setHint(t("map.hintBusy").replace("{n}", String(number)));
    setHint(null);
    onSelect(c);
  };

  return (
    <div>
      {webgl && (
        <div className="mb-3 flex rounded-xl border border-rn-line p-0.5 text-sm" role="tablist" aria-label={t("map.view")}>
          <button role="tab" aria-selected={view === "3d"} onClick={() => setView("3d")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 ${view === "3d" ? "bg-rn-violet/30 text-white" : "text-rn-muted"}`}>
            <Box className="h-4 w-4" /> {t("map.view3d")}
          </button>
          <button role="tab" aria-selected={view === "grid"} onClick={() => setView("grid")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 ${view === "grid" ? "bg-rn-violet/30 text-white" : "text-rn-muted"}`}>
            <LayoutGrid className="h-4 w-4" /> {t("map.viewList")}
          </button>
        </div>
      )}

      {view === "3d" && webgl ? (
        <>
          <div className="relative h-[60vh] max-h-[520px] min-h-[340px] overflow-hidden rounded-2xl border border-rn-line bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)]">
            <ClubMap3D layout={CLUB_LAYOUT} seats={seats} selected={selectedNumber} onSelect={pick} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-rn-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{t("map.free")}</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />{t("map.busy")}</span>
            {/* «Другой зал» — только если на схеме есть ПК, которых нет в выборе */}
            {seats.some((seat) => seat.state === "unknown") && (
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />{t("map.otherHall")}</span>
            )}
            <span className="w-full">{t("map.hint")}</span>
          </div>
          {hint && <p className="mt-2 text-sm text-amber-300">{hint}</p>}
        </>
      ) : (
        webgl !== null &&
        (groupByHall ? (
          <div className="space-y-4">
            {groupHalls(computers).map((hall, i) => (
              <div key={hall.name}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rn-muted">
                  {hall.name} · {hall.computers.length}
                </p>
                <SeatGrid computers={hall.computers} selectedId={selectedId} onSelect={onSelect} showLegend={i === 0} dense />
              </div>
            ))}
          </div>
        ) : (
          <SeatGrid computers={computers} selectedId={selectedId} onSelect={onSelect} />
        ))
      )}
    </div>
  );
}

/** Компьютеры по залам (категориям) в порядке номеров. */
function groupHalls(computers: ComputerDTO[]) {
  const halls = new Map<string, ComputerDTO[]>();
  for (const c of [...computers].sort((a, b) => a.number - b.number)) {
    const list = halls.get(c.category.name) ?? [];
    list.push(c);
    halls.set(c.category.name, list);
  }
  return Array.from(halls, ([name, list]) => ({ name, computers: list }));
}
