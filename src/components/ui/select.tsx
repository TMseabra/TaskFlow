"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";

export type SelectOption = { value: string; label: string; dotColor?: string };

export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  size = "md",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = options.find((o) => o.value === value);

  function openList() {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function choose(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const height = size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3 text-sm";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-card font-medium text-ink transition-colors hover:border-[#d5dae0] dark:hover:border-[#3a4552] ${height}`}
      >
        <span className={`flex min-w-0 items-center gap-2 ${current ? "" : "text-muted"}`}>
          {current?.dotColor && (
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: current.dotColor }} />
          )}
          <span className="truncate">{current?.label ?? placeholder}</span>
        </span>
        <ChevronDownIcon
          width={15}
          height={15}
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="animate-fade-in absolute z-30 mt-1.5 max-h-64 w-full min-w-[160px] overflow-auto rounded-xl border border-line bg-card p-1 shadow-lg shadow-navy/10"
        >
          {options.map((option, i) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value || "__all"}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                  i === active ? "bg-subtle text-ink" : "text-body"
                }`}
              >
                {option.dotColor && (
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: option.dotColor }} />
                )}
                <span className="flex-1 truncate">{option.label}</span>
                {selected && <CheckIcon width={14} height={14} className="text-brand" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
