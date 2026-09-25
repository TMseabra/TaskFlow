import type { Task } from "@prisma/client";

export type { Task };

export type TaskStatusValue = "TODO" | "IN_PROGRESS" | "DONE";
export type PriorityValue = "LOW" | "MEDIUM" | "HIGH";

export type ProjectRef = { id: string; name: string; color: string };

export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusValue;
  priority: PriorityValue;
  dueDate: string | null;
  assignee: string | null;
  project: ProjectRef | null;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  type:
    | "TASK_CREATED"
    | "TASK_COMPLETED"
    | "TASK_REOPENED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "PROJECT_CREATED"
    | "PROJECT_DELETED";
  actor: string;
  subject: string;
  createdAt: string;
};

export type ProjectProgressItem = ProjectRef & {
  total: number;
  done: number;
  progress: number;
};

// change is null when there was nothing to compare against last week.
export type StatSummary = { value: number; change: number | null };

export type ChartPoint = { label: string; value: number };

export type DashboardData = {
  stats: {
    total: StatSummary;
    inProgress: StatSummary;
    completed: StatSummary;
    overdue: StatSummary;
  };
  chart: { thisWeek: ChartPoint[]; lastWeek: ChartPoint[] };
  deadlines: TaskItem[];
  activity: ActivityItem[];
  recentTasks: TaskItem[];
  projects: ProjectProgressItem[];
};

export type NotificationItem = {
  id: string;
  title: string;
  dueDate: string;
  overdue: boolean;
};

export type ShellUser = { name: string; email: string };
