import { z } from "zod";

export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const priorityValues = ["LOW", "MEDIUM", "HIGH"] as const;

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task name is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(taskStatusValues).default("TODO"),
  priority: z.enum(priorityValues).default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().min(1).optional().nullable(),
  assignee: z.string().trim().max(80).optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(80),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color")
    .default("#00C96B"),
});
