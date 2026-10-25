"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface HorizontalCarouselProps {
  children: ReactNode;
  /** Подпись для скринридеров. */
  ariaLabel: string;
  /** Классы ширины слайда, например "w-[280px] sm:w-[320px]". */
  itemClassName?: string;
  className?: string;
  /** Показать кнопки прокрутки (на десктопе). */
  showControls?: boolean;
  /** Автопрокрутка, мс между шагами. Пауза при наведении, касании и фокусе; выключена при «уменьшить движение». */
  autoPlayMs?: number;
}

/**
 * Горизонтальная карусель на нативной прокрутке:
 * свайп на телефоне, перетаскивание мышью, кнопки и стрелки клавиатуры.
 */
export function HorizontalCarousel({
  children,
  ariaLabel,
  itemClassName = "w-[280px]",
  className = "",
  showControls = true,
  autoPlayMs,
}: HorizontalCarouselProps) {
  const reduceMotion = useReducedMotion();
  const paused = useRef(false);
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const slideStep = () => {
    const el = trackRef.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    return slide ? slide.offsetWidth + 20 : 1;
  };

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(atEnd ? count - 1 : slide ? Math.round(el.scrollLeft / (slide.offsetWidth + 20)) : 0);
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, [count]);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges, children]);

  // Автопрокрутка на один слайд; в конце — плавно к началу
  useEffect(() => {
    if (!autoPlayMs || reduceMotion) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || paused.current || drag.current.active || document.hidden) return;
      const step = slideStep();
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, reduceMotion]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // Перетаскивание мышью (тач обрабатывается нативной прокруткой)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !trackRef.current) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 5) {
      drag.current.moved = true;
      setIsDragging(true);
    }
    if (drag.current.moved) trackRef.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
  };
  // После перетаскивания клик по ссылке внутри слайда не срабатывает
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByPage(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByPage(-1);
    }
  };

  const controlClass =
    "hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-rn-line bg-rn-surface/80 text-white backdrop-blur transition hover:border-rn-magenta hover:shadow-[0_0_24px_rgba(217,70,239,0.45)] disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {showControls && (
        <div className="mb-5 flex justify-end gap-3">
          <button type="button" className={controlClass} onClick={() => scrollByPage(-1)} disabled={edges.start} aria-label={t("carousel.prev")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className={controlClass} onClick={() => scrollByPage(1)} disabled={edges.end} aria-label={t("carousel.next")}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={updateEdges}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className={`rn-no-scrollbar rn-fade-x -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 pt-2 outline-none focus-visible:ring-2 focus-visible:ring-rn-cyan/60 ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory scroll-smooth"
        }`}
      >
        {Children.map(children, (child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => trackRef.current?.scrollTo({ left: i * slideStep(), behavior: "smooth" })}
              aria-label={`${t("carousel.goTo")} ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-gradient-to-r from-rn-violet to-rn-magenta" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
