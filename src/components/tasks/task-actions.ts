"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { TaskItem, TaskStatusValue } from "@/types";

export function useTaskActions() {
  const router = useRouter();

  const update = useCallback(
    async (id: string, patch: Partial<Pick<TaskItem, "status" | "priority">>) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }).catch(() => null);
      if (!res?.ok) return null;
      const { task } = (await res.json()) as { task: TaskItem };
      router.refresh();
      return task;
    },
    [router]
  );

  const setStatus = useCallback(
    (id: string, status: TaskStatusValue) => update(id, { status }),
    [update]
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" }).catch(() => null);
      if (!res?.ok) return false;
      router.refresh();
      return true;
    },
    [router]
  );

  return { update, setStatus, remove };
}
