import type { PriorityValue, TaskStatusValue } from "@/types";

const statusStyles: Record<TaskStatusValue, string> = {
  TODO: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  IN_PROGRESS: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  DONE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export const statusLabels: Record<TaskStatusValue, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const priorityStyles: Record<PriorityValue, string> = {
  HIGH: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  MEDIUM: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  LOW: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export const priorityLabels: Record<PriorityValue, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const pill = "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium";

export function StatusBadge({ status }: { status: TaskStatusValue }) {
  return <span className={`${pill} ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: PriorityValue }) {
  return <span className={`${pill} ${priorityStyles[priority]}`}>{priorityLabels[priority]}</span>;
}

export function ProjectTag({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="truncate">{name}</span>
    </span>
  );
}
