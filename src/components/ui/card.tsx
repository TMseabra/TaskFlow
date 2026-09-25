import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(16,24,39,0.03)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,39,0.05)] ${
        padded ? "p-5 sm:p-6" : "overflow-hidden"
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  href,
  action,
}: {
  title: string;
  href?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {action ??
        (href && (
          <Link href={href} className="text-xs font-semibold text-brand hover:text-brand-hover">
            View all
          </Link>
        ))}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
      {children}
    </div>
  );
}
