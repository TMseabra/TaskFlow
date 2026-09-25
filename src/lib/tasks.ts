import type { Prisma } from "@prisma/client";
import type { TaskItem } from "@/types";

export const taskInclude = {
  project: { select: { id: true, name: true, color: true } },
} satisfies Prisma.TaskInclude;

type TaskWithProject = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

export function toTaskItem(task: TaskWithProject): TaskItem {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    assignee: task.assignee,
    project: task.project,
    createdAt: task.createdAt.toISOString(),
  };
}
