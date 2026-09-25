"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reads DOM state set by the inline anti-flash script; must run after mount
    // so server and client render the same placeholder first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("taskflow-theme", next ? "dark" : "light");
    } catch {
      // storage can be unavailable (private mode, blocked storage)
    }
  }

  const shape = `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card text-body ${className}`;

  if (!mounted) {
    return <div className={shape} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`${shape} transition-all duration-200 hover:scale-105 hover:border-brand hover:text-brand`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
