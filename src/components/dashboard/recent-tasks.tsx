"use client";

import { useState } from "react";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { ProjectTag, StatusBadge } from "@/components/ui/badge";
import { TaskCheckbox } from "@/components/tasks/task-checkbox";
import { TaskDetailsModal } from "@/components/tasks/task-details-modal";
import { useOptimisticStatus } from "@/components/tasks/use-optimistic-status";
import { formatDate } from "@/lib/dates";
import type { TaskItem } from "@/types";

function Row({
  task,
  done,
  status,
  interactive,
  onToggle,
  onOpen,
}: {
  task: TaskItem;
  done: boolean;
  status: TaskItem["status"];
  interactive: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const date = task.dueDate ?? task.createdAt;
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <TaskCheckbox checked={done} label={task.title} onToggle={interactive ? onToggle : undefined} />
      <div className="min-w-0 flex-1">
        {interactive ? (
          <button
            type="button"
            onClick={onOpen}
            className={`block max-w-full truncate text-left text-sm font-medium transition-colors hover:text-brand ${
              done ? "text-muted line-through" : "text-ink"
            }`}
          >
            {task.title}
          </button>
        ) : (
          <p className={`truncate text-sm font-medium ${done ? "text-muted line-through" : "text-ink"}`}>
            {task.title}
          </p>
        )}
        <div className="mt-0.5">
          {task.project ? (
            <ProjectTag name={task.project.name} color={task.project.color} />
          ) : (
            <span className="text-xs text-muted">No project</span>
          )}
        </div>
      </div>
      <StatusBadge status={status} />
      <span className="hidden w-14 shrink-0 text-right text-xs text-muted @md/main:block">
        {formatDate(date, false)}
      </span>
    </li>
  );
}

export function RecentTasks({ tasks, interactive = true }: { tasks: TaskItem[]; interactive?: boolean }) {
  const { statusOf, toggle } = useOptimisticStatus();
  const [openId, setOpenId] = useState<string | null>(null);
  const openTask = tasks.find((t) => t.id === openId) ?? null;

  return (
    <Card>
      <CardHeader title="Recent tasks" href="/tasks" />
      {tasks.length === 0 ? (
        <EmptyState>No tasks yet. Create your first one with “New task”.</EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {tasks.map((task) => {
            const status = statusOf(task);
            return (
              <Row
                key={task.id}
                task={task}
                status={status}
                done={status === "DONE"}
                interactive={interactive}
                onToggle={() => toggle(task)}
                onOpen={() => setOpenId(task.id)}
              />
            );
          })}
        </ul>
      )}
      {interactive && (
        <TaskDetailsModal task={openTask} onClose={() => setOpenId(null)} />
      )}
    </Card>
  );
}
