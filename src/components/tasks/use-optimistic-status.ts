"use client";

import { useCallback, useState } from "react";
import { useTaskActions } from "@/components/tasks/task-actions";
import type { TaskItem, TaskStatusValue } from "@/types";

type Pending = { status: TaskStatusValue; base: TaskStatusValue };

// Shows the new status immediately, and falls back to server data once a refresh
// delivers a status different from the one the change was based on.
export function useOptimisticStatus() {
  const { setStatus } = useTaskActions();
  const [pending, setPending] = useState<Record<string, Pending>>({});

  const statusOf = useCallback(
    (task: TaskItem) => {
      const p = pending[task.id];
      return p && task.status === p.base ? p.status : task.status;
    },
    [pending]
  );

  const change = useCallback(
    async (task: TaskItem, status: TaskStatusValue) => {
      setPending((prev) => ({ ...prev, [task.id]: { status, base: task.status } }));
      const updated = await setStatus(task.id, status);
      if (!updated) {
        setPending((prev) => {
          const next = { ...prev };
          delete next[task.id];
          return next;
        });
      }
    },
    [setStatus]
  );

  const toggle = useCallback(
    (task: TaskItem) => change(task, statusOf(task) === "DONE" ? "TODO" : "DONE"),
    [change, statusOf]
  );

  return { statusOf, change, toggle };
}
