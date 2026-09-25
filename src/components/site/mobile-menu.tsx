"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { useDismiss } from "@/components/ui/use-dismiss";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
  { href: "/login", label: "Sign in" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-body"
      >
        {open ? <CloseIcon width={19} height={19} /> : <MenuIcon width={19} height={19} />}
      </button>

      {open && (
        <div className="animate-fade-in-up absolute inset-x-0 top-full border-b border-line bg-page px-5 py-4 shadow-lg shadow-navy/5">
          <nav aria-label="Mobile" className="flex flex-col gap-1 text-base font-medium text-body">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-lg px-3 py-2.5 hover:bg-subtle hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
