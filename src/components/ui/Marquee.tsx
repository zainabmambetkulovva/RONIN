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

/**
 * Бесконечная плавная лента: едет сама (transform, без рывков и без «конца»),
 * останавливается под пальцем или курсором, её можно тянуть пальцем и мышью.
 * При «уменьшить движение» лента не едет сама, но тянется.
 */
export function Marquee({ children, ariaLabel, itemClassName = "w-[260px]", speed = 40, className = "" }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, hover: false, drag: false, startX: 0, startOffset: 0, moved: false, resumeAt: 0 });
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
      const half = track.scrollWidth / 2;
      if (!reduceMotion && !s.hover && !s.drag && now >= s.resumeAt && half > 0) s.x += speed * dt;
      if (half > 0) s.x = ((s.x % half) + half) % half;
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
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.drag) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (s.moved) s.x = s.startOffset - dx;
  };
  const endDrag = () => {
    const s = state.current;
    if (!s.drag) return;
    s.drag = false;
    s.resumeAt = performance.now() + 1500;
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
    <div key={key} className={`shrink-0 ${itemClassName}`} style={{ marginRight: GAP }} aria-hidden={hidden || undefined} {...((hidden ? { inert: "" } : {}) as object)}>
      {child}
    </div>
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={`rn-fade-x -mx-4 cursor-grab touch-pan-y select-none overflow-hidden py-2 active:cursor-grabbing ${className}`}
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
        {items.map((child, i) => slide(child, `a${i}`, false))}
        {/* Второй набор — для бесшовного повтора */}
        {items.map((child, i) => slide(child, `b${i}`, true))}
      </div>
    </div>
  );
}
