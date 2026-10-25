"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFloating } from "./useFloating";
import { Check, ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  /** Подпись для скринридеров (и видимая, если showLabel). */
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/** Выпадающий список в стиле сайта: клавиатура (стрелки, Enter, Esc), закрытие по клику вне. */
export function Dropdown({ value, onChange, options, label, placeholder = "Выберите", className = "", disabled }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pos = useFloating(buttonRef, open, 256);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) {
      const i = Math.max(0, options.findIndex((o) => o.value === value));
      setActive(i);
      requestAnimationFrame(() => listRef.current?.children[i]?.scrollIntoView({ block: "nearest" }));
    }
  }, [open, options, value]);

  const choose = (v: string) => {
    if (options.find((o) => o.value === v)?.disabled) return;
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) choose(options[active].value);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex w-full min-w-[9rem] items-center justify-between gap-3 rounded-xl border bg-rn-night px-3 py-2 text-left text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-40 ${
          open ? "border-rn-violet shadow-[0_0_0_3px_rgba(139,92,246,0.2)]" : "border-rn-line hover:border-rn-violet/50"
        }`}
      >
        <span className={`truncate ${selected ? "" : "text-rn-muted"}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-rn-muted transition-transform ${open ? "rotate-180 text-white" : ""}`} />
      </button>

      {open &&
        pos &&
        createPortal(
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          style={{ position: "fixed", left: pos.left, width: pos.width, maxHeight: pos.maxHeight, ...(pos.up ? { bottom: window.innerHeight - pos.top } : { top: pos.top }) }}
          className="z-[1000] overflow-y-auto rounded-xl border border-rn-line bg-rn-surface p-1 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSel}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o.value)}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  o.disabled ? "cursor-not-allowed text-white/25" : i === active ? "cursor-pointer bg-rn-violet/25 text-white" : "cursor-pointer text-white/85"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && <span className="block truncate text-xs text-rn-muted">{o.hint}</span>}
                </span>
                {isSel && <Check className="h-4 w-4 shrink-0 text-rn-cyan" />}
              </li>
            );
          })}
          {options.length === 0 && <li className="px-3 py-2 text-sm text-rn-muted">Нет вариантов</li>}
        </ul>,
          document.body
        )}
    </div>
  );
}
