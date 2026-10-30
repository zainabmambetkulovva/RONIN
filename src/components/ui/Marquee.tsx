"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  children: ReactNode;
  /** Подпись для скринридеров. */
  ariaLabel: string;
  /** Классы ширины слайда, например "w-[220px]". */
  itemClassName?: string;
  /** Скорость, px в секунду. */
  speed?: number;
  className?: string;
}

const GAP = 20;
/** Сколько раз повторяется набор: хватает для бесшовной ленты даже при 4–5 карточках на широком экране. */
const COPIES = 3;

/**
 * Бесконечная плавная лента: едет сама (transform, без рывков и без «конца»),
 * останавливается под пальцем или курсором, её можно тянуть пальцем и мышью.
 * При «уменьшить движение» лента не едет сама, но тянется.
 */
export function Marquee({ children, ariaLabel, itemClassName = "w-[260px]", speed = 40, className = "" }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  // v — скорость инерции после свайпа (px/с); lastX/lastT — для её расчёта
  const state = useRef({ x: 0, hover: false, drag: false, startX: 0, startOffset: 0, moved: false, resumeAt: 0, v: 0, lastX: 0, lastT: 0 });
  const items = Children.toArray(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const s = state.current;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      // Ширина одного набора карточек вместе с промежутком
      const period = track.scrollWidth / COPIES;
      // Инерция после свайпа: лента докатывается и плавно останавливается
      if (!s.drag && s.v !== 0) {
        s.x += s.v * dt;
        s.v *= Math.exp(-dt * 3.2);
        if (Math.abs(s.v) < 15) s.v = 0;
      }
      if (!reduceMotion && !s.hover && !s.drag && s.v === 0 && now >= s.resumeAt && period > 0) s.x += speed * dt;
      if (period > 0) s.x = ((s.x % period) + period) % period;
      track.style.transform = `translate3d(${-s.x}px,0,0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, speed]);

  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.drag = true;
    s.moved = false;
    s.startX = e.clientX;
    s.startOffset = s.x;
    s.v = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.drag) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (s.moved) {
      s.x = s.startOffset - dx;
      const now = performance.now();
      const dt = (now - s.lastT) / 1000;
      if (dt > 0) s.v = Math.max(-3000, Math.min(3000, (-(e.clientX - s.lastX) / dt) * 0.6 + s.v * 0.4));
      s.lastX = e.clientX;
      s.lastT = now;
    }
  };
  const endDrag = () => {
    const s = state.current;
    if (!s.drag) return;
    s.drag = false;
    // Палец давно стоит — без инерции; после свайпа лента сама не едет ещё 3 секунды
    if (!s.moved || performance.now() - s.lastT > 120) s.v = 0;
    s.resumeAt = performance.now() + 3000;
  };
  // После перетаскивания клик внутри карточки не срабатывает
  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  const slide = (child: ReactNode, key: string, hidden: boolean) => (
    // Повторы скрыты от скринридеров, но нажимаются: лента едет, и под пальцем часто оказывается именно повтор
    <div key={key} className={`shrink-0 ${itemClassName}`} style={{ marginRight: GAP }} aria-hidden={hidden || undefined}>
      {child}
    </div>
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={`rn-fade-x -mx-4 cursor-grab touch-pan-y select-none overflow-hidden py-8 -my-6 [contain:inline-size] active:cursor-grabbing ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") state.current.hover = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") state.current.hover = false;
        endDrag();
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {/* Первый набор доступен скринридерам и клавиатуре, повторы — только для бесшовной ленты */}
        {Array.from({ length: COPIES }, (_, copy) => items.map((child, i) => slide(child, `${copy}-${i}`, copy > 0)))}
      </div>
    </div>
  );
}
