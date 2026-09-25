import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-ink @xl/main:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted @xl/main:text-[15px]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
