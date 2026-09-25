"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/logo";
import {
  CalendarIcon,
  CrownIcon,
  DashboardIcon,
  ProjectsIcon,
  ReportsIcon,
  SettingsIcon,
  TasksIcon,
  TeamIcon,
} from "@/components/ui/icons";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/tasks", label: "Tasks", Icon: TasksIcon },
  { href: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { href: "/projects", label: "Projects", Icon: ProjectsIcon },
  { href: "/team", label: "Team", Icon: TeamIcon },
  { href: "/reports", label: "Reports", Icon: ReportsIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function Sidebar({
  activeHref,
  onNavigate,
  className = "",
}: {
  activeHref?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const current = activeHref ?? pathname;

  return (
    <aside className={`flex h-full flex-col border-r border-line bg-card px-4 py-6 ${className}`}>
      <Link href="/dashboard" onClick={onNavigate} className="mb-9 px-2" aria-label="Taskflow dashboard">
        <Logo iconSize={26} textClassName="text-[24px]" />
      </Link>

      <nav aria-label="Main" className="flex-1">
        <ul className="space-y-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = current === href || current.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-soft text-brand"
                      : "text-body hover:bg-subtle hover:text-ink"
                  }`}
                >
                  <Icon width={19} height={19} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 rounded-2xl border border-line bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <CrownIcon width={18} height={18} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Upgrade to Pro</p>
            <p className="text-xs text-muted">Unlock more features</p>
          </div>
        </div>
        <Link
          href="/settings#plan"
          onClick={onNavigate}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-lg border border-brand/40 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-soft"
        >
          Upgrade now
        </Link>
      </div>
    </aside>
  );
}
