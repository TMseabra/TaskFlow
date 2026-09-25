import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/ui/icons";
import type { StatSummary } from "@/types";

const tones = {
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  red: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
};

export function StatCard({
  label,
  stat,
  icon,
  tone,
  higherIsBetter = true,
}: {
  label: string;
  stat: StatSummary;
  icon: ReactNode;
  tone: keyof typeof tones;
  higherIsBetter?: boolean;
}) {
  const { value, change } = stat;
  const good = !change ? null : change > 0 === higherIsBetter;
  const changeColor =
    good === null ? "text-muted" : good ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400";
  const Arrow = change !== null && change < 0 ? ArrowDownIcon : ArrowUpIcon;

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(16,24,39,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,24,39,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-body">{label}</p>
          <p className="mt-2 text-[30px] font-bold leading-none tracking-tight text-ink">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      {change === null ? (
        <p className="mt-4 text-xs text-muted">New this week</p>
      ) : (
        <p className="mt-4 flex items-center gap-1 text-xs text-muted">
          <span className={`inline-flex items-center gap-0.5 font-semibold ${changeColor}`}>
            {change !== 0 && <Arrow width={13} height={13} strokeWidth={2.4} />}
            {Math.abs(change)}%
          </span>
          from last week
        </p>
      )}
    </div>
  );
}
