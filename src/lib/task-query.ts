import type { Prisma, Priority, TaskStatus } from "@prisma/client";
import { taskStatusValues, priorityValues } from "@/lib/validations/task";

export type TaskFilters = {
  search?: string;
  status?: string;
  priority?: string;
  project?: string;
};

export function buildTaskWhere(userId: string, filters: TaskFilters): Prisma.TaskWhereInput {
  const { search, status, priority, project } = filters;
  return {
    userId,
    ...(status && (taskStatusValues as readonly string[]).includes(status)
      ? { status: status as TaskStatus }
      : {}),
    ...(priority && (priorityValues as readonly string[]).includes(priority)
      ? { priority: priority as Priority }
      : {}),
    ...(project === "none" ? { projectId: null } : project ? { projectId: project } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { assignee: { contains: search, mode: "insensitive" } },
            { project: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
}
