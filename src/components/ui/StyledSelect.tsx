"use client";

import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Dropdown } from "./Dropdown";

interface StyledSelectProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  children: ReactNode;
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  // Остальные атрибуты стандартного <select> (style, id, required…) принимаются и игнорируются
  [key: string]: unknown;
}

/**
 * Замена стандартного <select> с теми же value / onChange(e) / <option> внутри,
 * но с выпадающим списком в стиле сайта.
 */
export function StyledSelect({ value, onChange, children, className, disabled, ...rest }: StyledSelectProps) {
  const options = Children.toArray(children)
    .filter((c): c is ReactElement<{ value?: string; children?: ReactNode; disabled?: boolean }> => isValidElement(c))
    .map((c) => ({
      value: String(c.props.value ?? ""),
      label: Children.toArray(c.props.children).join(""),
      disabled: c.props.disabled,
    }));
  return (
    <Dropdown
      value={String(value ?? "")}
      onChange={(v) => onChange({ target: { value: v } })}
      options={options}
      label={(rest["aria-label"] as string) ?? options.find((o) => o.value === value)?.label ?? ""}
      disabled={disabled}
      className={className?.includes("w-full") ? "w-full" : ""}
    />
  );
}
