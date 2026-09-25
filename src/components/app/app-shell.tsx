"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/app/sidebar";
import { SearchBar } from "@/components/app/search-bar";
import { Notifications } from "@/components/app/notifications";
import { UserMenu } from "@/components/app/user-menu";
import { WorkspaceProvider } from "@/components/app/workspace-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/site/logo";
import { MenuIcon } from "@/components/ui/icons";
import type { NotificationItem, ProjectRef, ShellUser } from "@/types";

export function AppShell({
  user,
  projects,
  assignees,
  notifications,
  preview = false,
  activeHref,
  children,
}: {
  user: ShellUser;
  projects: ProjectRef[];
  assignees: string[];
  notifications: NotificationItem[];
  preview?: boolean;
  activeHref?: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <WorkspaceProvider value={{ user, projects, assignees, preview }}>
      <div className={`@container/shell flex w-full bg-subtle ${preview ? "h-full" : "min-h-screen"}`}>
        <div
          className={`hidden w-60 shrink-0 @3xl/shell:block @6xl/shell:w-64 ${
            preview ? "" : "sticky top-0 h-screen"
          }`}
        >
          <Sidebar activeHref={activeHref} />
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 @3xl/shell:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="animate-fade-in absolute inset-0 bg-navy/40" onClick={closeMenu} aria-hidden="true" />
            <div className="animate-fade-in-up absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
              <Sidebar activeHref={activeHref} onNavigate={closeMenu} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-line bg-card/90 px-4 backdrop-blur @xl/shell:px-6 @6xl/shell:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-body hover:bg-subtle @3xl/shell:hidden"
            >
              <MenuIcon width={20} height={20} />
            </button>
            <span className="@xl/shell:hidden">
              <Logo iconSize={22} textClassName="text-[19px]" />
            </span>
            <SearchBar id="search-desktop" className="hidden w-full max-w-md @xl/shell:block" />
            <div className="ml-auto flex items-center gap-1.5 @xl/shell:gap-3">
              <ThemeToggle />
              <Notifications items={notifications} />
              <UserMenu user={user} />
            </div>
          </header>

          <main className="@container/main flex-1 px-4 py-6 @xl/shell:px-6 @6xl/shell:px-8 @6xl/shell:py-8">
            <div className="mb-5 @xl/shell:hidden">
              <SearchBar id="search-mobile" />
            </div>
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
