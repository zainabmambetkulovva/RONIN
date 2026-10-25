"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

export interface FloatingPosition {
  left: number;
  top: number;
  width: number;
  /** Открыто вверх (снизу не хватает места). */
  up: boolean;
  maxHeight: number;
}

/**
 * Позиция всплывающего окна (список, календарь) относительно кнопки — в координатах экрана.
 * Окно рисуется через портал поверх страницы, поэтому его не обрезают карточки и не перекрывают соседние блоки.
 */
export function useFloating(anchorRef: RefObject<HTMLElement>, open: boolean, preferredHeight: number, minWidth = 0) {
  const [pos, setPos] = useState<FloatingPosition | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const gap = 8;
      const below = window.innerHeight - r.bottom - gap - 8;
      const above = r.top - gap - 8;
      const up = below < Math.min(preferredHeight, 220) && above > below;
      const width = Math.max(r.width, minWidth);
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
      setPos({
        left,
        width,
        up,
        top: up ? r.top - gap : r.bottom + gap,
        maxHeight: Math.max(120, Math.min(preferredHeight, up ? above : below)),
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef, preferredHeight, minWidth]);

  return pos;
}
