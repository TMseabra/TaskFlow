import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/dates";
import type { ActivityItem } from "@/types";

export const activityVerb: Record<ActivityItem["type"], string> = {
  TASK_CREATED: "created a task",
  TASK_COMPLETED: "completed a task",
  TASK_REOPENED: "reopened a task",
  TASK_UPDATED: "updated a task",
  TASK_DELETED: "deleted a task",
  PROJECT_CREATED: "created a project",
  PROJECT_DELETED: "deleted a project",
};

export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar name={item.actor} size={30} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-body">
              <span className="font-semibold text-ink">{item.actor}</span> {activityVerb[item.type]}
            </p>
            <p className="truncate text-xs text-muted">{item.subject}</p>
          </div>
          <span className="shrink-0 text-xs text-muted">{timeAgo(item.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}

export function ActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader title="Team activity" href="/team" />
      {items.length === 0 ? (
        <EmptyState>Activity will appear here as you work on tasks.</EmptyState>
      ) : (
        <ActivityList items={items} />
      )}
    </Card>
  );
}
