"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge, ProjectTag } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/card";
import { TaskCheckbox } from "@/components/tasks/task-checkbox";
import { TaskDetailsModal, type DetailsMode } from "@/components/tasks/task-details-modal";
import { statusOptions } from "@/components/tasks/task-form";
import { useOptimisticStatus } from "@/components/tasks/use-optimistic-status";
import { formatDue, isOverdue } from "@/lib/dates";
import type { TaskItem, TaskStatusValue } from "@/types";

const iconButton = "flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors";

export function TaskList({
  tasks,
  linkedTask,
  hasFilters,
}: {
  tasks: TaskItem[];
  linkedTask?: TaskItem | null;
  hasFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { statusOf, change, toggle } = useOptimisticStatus();
  const [selection, setSelection] = useState<{ id: string; mode: DetailsMode } | null>(
    linkedTask ? { id: linkedTask.id, mode: "view" } : null
  );
  const [lastLinkedId, setLastLinkedId] = useState(linkedTask?.id ?? null);

  // Open the linked task when ?open= changes while this page is already mounted.
  const linkedId = linkedTask?.id ?? null;
  if (linkedId !== lastLinkedId) {
    setLastLinkedId(linkedId);
    if (linkedId) setSelection({ id: linkedId, mode: "view" });
  }

  const selectedTask = selection
    ? tasks.find((t) => t.id === selection.id) ??
      (linkedTask?.id === selection.id ? linkedTask : null)
    : null;

  function closeDetails() {
    setSelection(null);
    if (searchParams.get("open")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("open");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }

  if (tasks.length === 0) {
    return (
      <>
        <EmptyState>
          {hasFilters ? "No tasks match these filters." : "No tasks yet. Create your first one with “New task”."}
        </EmptyState>
        <TaskDetailsModal
          key={selection ? `${selection.id}-${selection.mode}` : "none"}
          task={selectedTask}
          initialMode={selection?.mode}
          onClose={closeDetails}
        />
      </>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="hidden grid-cols-[minmax(0,1fr)_140px_90px_150px_150px_72px] gap-4 border-b border-line bg-subtle px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted @4xl/main:grid">
        <span className="pl-8">Task</span>
        <span>Assignee</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Due</span>
        <span className="sr-only">Actions</span>
      </div>
      <ul className="divide-y divide-line">
        {tasks.map((task) => {
          const status = statusOf(task);
          const done = status === "DONE";
          const overdue = isOverdue(task.dueDate, status);
          return (
            <li
              key={task.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3.5 transition-colors hover:bg-subtle/60 @xl/main:px-5 @4xl/main:grid-cols-[minmax(0,1fr)_140px_90px_150px_150px_72px]"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="pt-0.5">
                  <TaskCheckbox checked={done} label={task.title} onToggle={() => toggle(task)} />
                </span>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelection({ id: task.id, mode: "view" })}
                    className={`block max-w-full truncate text-left text-sm font-medium transition-colors hover:text-brand ${
                      done ? "text-muted line-through" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </button>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {task.project && <ProjectTag name={task.project.name} color={task.project.color} />}
                    <span className="@4xl/main:hidden">
                      <PriorityBadge priority={task.priority} />
                    </span>
                    {task.dueDate && (
                      <span
                        className={`text-xs @4xl/main:hidden ${overdue ? "font-medium text-red-600 dark:text-red-400" : "text-muted"}`}
                      >
                        {formatDue(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden min-w-0 items-center gap-2 @4xl/main:flex">
                {task.assignee ? (
                  <>
                    <Avatar name={task.assignee} size={24} />
                    <span className="truncate text-sm text-body">{task.assignee}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted">—</span>
                )}
              </div>

              <div className="hidden @4xl/main:block">
                <PriorityBadge priority={task.priority} />
              </div>

              <Select
                size="sm"
                className="w-32 @4xl/main:w-full"
                label={`Status of ${task.title}`}
                value={status}
                onChange={(v) => change(task, v as TaskStatusValue)}
                options={statusOptions}
                placeholder="Status"
              />

              <span
                className={`hidden whitespace-nowrap text-sm @4xl/main:block ${
                  overdue ? "font-medium text-red-600 dark:text-red-400" : task.dueDate ? "text-body" : "text-muted"
                }`}
              >
                {task.dueDate ? formatDue(task.dueDate) : "—"}
              </span>

              <div className="hidden justify-end gap-1 @4xl/main:flex">
                <button
                  type="button"
                  aria-label={`Edit ${task.title}`}
                  className={`${iconButton} hover:bg-subtle hover:text-ink`}
                  onClick={() => setSelection({ id: task.id, mode: "edit" })}
                >
                  <PencilIcon width={16} height={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  className={`${iconButton} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400`}
                  onClick={() => setSelection({ id: task.id, mode: "delete" })}
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <TaskDetailsModal
        key={selection ? `${selection.id}-${selection.mode}` : "none"}
        task={selectedTask}
        initialMode={selection?.mode}
        onClose={closeDetails}
      />
    </div>
  );
}
