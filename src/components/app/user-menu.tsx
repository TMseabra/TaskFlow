"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDownIcon, LogOutIcon, SettingsIcon } from "@/components/ui/icons";
import { useDismiss } from "@/components/ui/use-dismiss";
import type { ShellUser } from "@/types";

export function UserMenu({ user }: { user: ShellUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const displayName = user.name || user.email.split("@")[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-3 rounded-full p-0.5 pr-1 transition-colors hover:bg-subtle @xl/shell:rounded-xl @xl/shell:pr-2"
      >
        <Avatar name={displayName} size={38} color="#00C96B" />
        <span className="hidden min-w-0 text-left @4xl/shell:block">
          <span className="block max-w-40 truncate text-sm font-semibold text-ink">{displayName}</span>
          <span className="block max-w-40 truncate text-xs text-muted">{user.email}</span>
        </span>
        <ChevronDownIcon width={16} height={16} className="hidden text-muted @xl/shell:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-card p-1 shadow-lg shadow-navy/10"
        >
          <div className="border-b border-line px-3 py-2.5 @4xl/shell:hidden">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <Link
            href="/settings"
            role="menuitem"
            onClick={close}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-body hover:bg-subtle hover:text-ink"
          >
            <SettingsIcon width={16} height={16} />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOutIcon width={16} height={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
