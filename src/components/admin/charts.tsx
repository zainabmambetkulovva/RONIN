"use client";

import { useId, useState } from "react";

/** Плавная кривая через точки (кубические Безье по средним точкам). */
function smoothPath(points: Array<[number, number]>) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

/** Линейный график с заливкой и подсказкой при наведении. */
export function AreaChart({
  data,
  format,
  height = 220,
}: {
  data: Array<{ label: string; value: number }>;
  format: (v: number) => string;
  height?: number;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { top: 16, right: 12, bottom: 28, left: 48 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 4 / 10) * 10 * 4 || 4;
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / niceMax) * innerH;
  const points = data.map((d, i) => [x(i), y(d.value)] as [number, number]);
  const line = smoothPath(points);
  const area = points.length > 1 ? `${line} L${points[points.length - 1][0]},${pad.top + innerH} L${points[0][0]},${pad.top + innerH} Z` : "";
  const ticks = [0, 1, 2, 3, 4].map((k) => (niceMax / 4) * k);
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="График выручки">
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="fill-rn-muted text-[10px]">
              {t >= 1000 ? `${Math.round(t / 100) / 10}k` : Math.round(t)}
            </text>
          </g>
        ))}
        {area && <path d={area} fill={`url(#fill-${id})`} />}
        <path d={line} fill="none" stroke={`url(#line-${id})`} strokeWidth="3" strokeLinecap="round" />
        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text key={d.label} x={x(i)} y={H - 8} textAnchor="middle" className="fill-rn-muted text-[10px]">
              {d.label}
            </text>
          ) : null
        )}
        {hover !== null && points[hover] && (
          <g>
            <line x1={points[hover][0]} x2={points[hover][0]} y1={pad.top} y2={pad.top + innerH} stroke="rgba(168,85,247,0.5)" strokeDasharray="3 4" />
            <circle cx={points[hover][0]} cy={points[hover][1]} r="6" fill="#0b0b1a" stroke="#d946ef" strokeWidth="3" />
          </g>
        )}
        {hover === null && data.length === 1 && points[0] && <circle cx={points[0][0]} cy={points[0][1]} r="6" fill="#0b0b1a" stroke="#d946ef" strokeWidth="3" />}
        {/* Невидимые зоны наведения */}
        {data.map((d, i) => (
          <rect
            key={`h-${d.label}`}
            x={x(i) - innerW / Math.max(1, data.length) / 2}
            y={pad.top}
            width={innerW / Math.max(1, data.length)}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onTouchStart={() => setHover(i)}
          />
        ))}
      </svg>
      {hover !== null && points[hover] && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-rn-violet px-2.5 py-1.5 text-center text-xs font-semibold text-white shadow-lg"
          style={{ left: `${(points[hover][0] / W) * 100}%`, top: `${(points[hover][1] / H) * 100 - 3}%` }}
        >
          <div className="text-[10px] font-normal text-white/80">{data[hover].label}</div>
          {format(data[hover].value)}
        </div>
      )}
    </div>
  );
}

/** Кольцевая диаграмма с подписью в центре. */
export function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[220px]">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" role="img" aria-label={centerLabel}>
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />
        {total > 0 &&
          segments.map((s) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={s.label}
                cx="90"
                cy="90"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeDasharray={`${Math.max(0, len - 3)} ${C}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-rn-muted">{centerLabel}</span>
        <span className="font-display text-3xl font-bold text-white">{centerValue}</span>
      </div>
    </div>
  );
}

/** Полукруглая шкала (0–100%). */
export function Gauge({ percent, label, caption }: { percent: number; label: string; caption: string }) {
  const id = useId().replace(/:/g, "");
  const p = Math.min(100, Math.max(0, percent));
  const R = 80;
  const half = Math.PI * R;
  const angle = Math.PI * (1 - p / 100);
  const knob = [100 + R * Math.cos(angle), 100 - R * Math.sin(angle)];
  const level = p >= 80 ? { text: "Высокая", cls: "bg-orange-500" } : p >= 40 ? { text: "Средняя", cls: "bg-rn-violet" } : { text: "Низкая", cls: "bg-emerald-500" };
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 200 124" className="w-full" role="img" aria-label={`${label}: ${Math.round(p)}%`}>
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d={`M${100 - R},100 A${R},${R} 0 0 1 ${100 + R},100`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="16" strokeLinecap="round" />
        <path
          d={`M${100 - R},100 A${R},${R} 0 0 1 ${100 + R},100`}
          fill="none"
          stroke={`url(#g-${id})`}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * half} ${half}`}
          className="transition-all duration-700"
        />
        <circle cx={knob[0]} cy={knob[1]} r="9" fill="#fff" stroke="#0b0b1a" strokeWidth="3" />
        <text x="20" y="118" textAnchor="middle" className="fill-rn-muted text-[9px]">0%</text>
        <text x="180" y="118" textAnchor="middle" className="fill-rn-muted text-[9px]">100%</text>
      </svg>
      <div className="absolute inset-x-0 top-[42%] flex flex-col items-center">
        <span className="text-xs text-rn-muted">{label}</span>
        <span className="font-display text-3xl font-bold text-white">{Math.round(p)}%</span>
        <span className={`mt-1 rounded-full px-3 py-0.5 text-[11px] font-semibold text-white ${level.cls}`}>{level.text}</span>
      </div>
      <p className="mt-2 text-center text-xs text-rn-muted">{caption}</p>
    </div>
  );
}
