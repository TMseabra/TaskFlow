import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { PriorityBadge } from "@/components/ui/badge";
import { formatDue } from "@/lib/dates";
import type { TaskItem } from "@/types";

const dot = { HIGH: "bg-red-500", MEDIUM: "bg-amber-500", LOW: "bg-emerald-500" };

export function DeadlineCard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <Card>
      <CardHeader title="Upcoming deadlines" href="/tasks" />
      {tasks.length === 0 ? (
        <EmptyState>No upcoming deadlines.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot[task.priority]}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{task.title}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDue(task.dueDate!)}</p>
              </div>
              <PriorityBadge priority={task.priority} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
