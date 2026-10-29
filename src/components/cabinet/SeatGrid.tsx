"use client";

import { Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ComputerDTO } from "@/types/api";

/**
 * Схема мест для выбранного интервала. Доступность — из /api/computers (availableForSlot),
 * а не из текущего статуса: сейчас ПК может быть занят, но свободен на выбранное время.
 */
export function SeatGrid({
  computers,
  selectedId,
  onSelect,
  showLegend = true,
  dense = false,
}: {
  computers: ComputerDTO[];
  selectedId: string | null;
  onSelect: (computer: ComputerDTO) => void;
  /** Легенда цветов над сеткой (выключается, когда сеток несколько — по залам). */
  showLegend?: boolean;
  /** Мелкие кнопки — когда показаны все ПК клуба. */
  dense?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div>
      {showLegend && <div className="mb-4 flex flex-wrap gap-4 text-xs text-rn-muted">
        <Legend className="border-rn-cyan/60 bg-rn-cyan/10" label={t("cab.seat.free")} />
        <Legend className="border-rn-pink/50 bg-rn-pink/15" label={t("cab.seat.busy")} />
        <Legend className="border-rn-line bg-white/[0.03]" label={t("cab.seat.maintenance")} />
        <Legend className="border-transparent bg-gradient-to-br from-rn-violet to-rn-magenta" label={t("cab.seat.selected")} />
      </div>}

      <div className={dense ? "grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5" : "grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10"} role="listbox" aria-label={t("cab.book.step3")}>
        {computers.map((pc) => {
          const maintenance = pc.status === "maintenance";
          const free = pc.availableForSlot === true;
          const selected = pc.id === selectedId;
          const label = `${t("cab.seat.pc")} ${pc.number}: ${maintenance ? t("cab.seat.maintenance") : free ? t("cab.seat.free") : t("cab.seat.busy")}`;

          return (
            <button
              key={pc.id}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={label}
              title={label}
              disabled={!free}
              onClick={() => onSelect(pc)}
              className={`relative flex aspect-square items-center justify-center rounded-xl border font-display text-sm font-bold transition ${
                selected
                  ? "border-transparent bg-gradient-to-br from-rn-violet to-rn-magenta text-white shadow-[0_0_20px_rgba(217,70,239,0.55)]"
                  : maintenance
                    ? "cursor-not-allowed border-rn-line bg-white/[0.03] text-rn-muted/50"
                    : free
                      ? "border-rn-cyan/50 bg-rn-cyan/[0.07] text-white hover:-translate-y-0.5 hover:border-rn-cyan hover:shadow-[0_0_16px_rgba(34,211,238,0.4)]"
                      : "cursor-not-allowed border-rn-pink/40 bg-rn-pink/10 text-rn-pink/70"
              }`}
            >
              {maintenance ? <Wrench className="h-4 w-4" aria-hidden /> : pc.number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded border ${className}`} aria-hidden />
      {label}
    </span>
  );
}
