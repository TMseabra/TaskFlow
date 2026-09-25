"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { BellIcon } from "@/components/ui/icons";
import { useDismiss } from "@/components/ui/use-dismiss";
import { formatDue } from "@/lib/dates";
import type { NotificationItem } from "@/types";

export function Notifications({ items }: { items: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const count = items.length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={count ? `Notifications, ${count} need attention` : "Notifications"}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-subtle hover:text-ink"
      >
        <BellIcon width={20} height={20} />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-card">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-card shadow-lg shadow-navy/10">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <p className="text-xs text-muted">Overdue and upcoming deadlines</p>
          </div>
          {count === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">You&apos;re all caught up.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/tasks?open=${item.id}`}
                    onClick={close}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-subtle"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.overdue ? "bg-red-500" : "bg-amber-500"}`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                      <span className={`text-xs ${item.overdue ? "text-red-600 dark:text-red-400" : "text-muted"}`}>
                        {item.overdue ? "Overdue · " : "Due "}
                        {formatDue(item.dueDate)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
