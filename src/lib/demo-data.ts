import { DAY_MS, utcDayStart } from "@/lib/dates";
import type { DashboardData, NotificationItem, ProjectRef, ShellUser, TaskItem } from "@/types";

const projects: Record<string, ProjectRef> = {
  web: { id: "demo-web", name: "Website Redesign", color: "#00C96B" },
  mobile: { id: "demo-mobile", name: "Mobile App", color: "#3B82F6" },
  marketing: { id: "demo-marketing", name: "Marketing", color: "#8B5CF6" },
  api: { id: "demo-api", name: "API Development", color: "#F59E0B" },
};

export const demoUser: ShellUser = {
  name: "John Doe",
  email: "john@example.com",
};

export function getDemoDashboardData(now = new Date()): DashboardData {
  const today = utcDayStart(now).getTime();
  const at = (days: number, hours = 0) =>
    new Date(today + days * DAY_MS + hours * 3600 * 1000).toISOString();
  const ago = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000).toISOString();

  const task = (
    id: string,
    title: string,
    status: TaskItem["status"],
    priority: TaskItem["priority"],
    project: ProjectRef,
    dueDate: string | null,
    createdAt: string
  ): TaskItem => ({
    id,
    title,
    description: null,
    status,
    priority,
    dueDate,
    assignee: null,
    project,
    createdAt,
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return {
    stats: {
      total: { value: 128, change: 12 },
      inProgress: { value: 64, change: 8 },
      completed: { value: 48, change: 16 },
      overdue: { value: 16, change: -4 },
    },
    chart: {
      thisWeek: [22, 38, 30, 64, 76, 41, 83].map((value, i) => ({ label: days[i], value })),
      lastWeek: [18, 26, 35, 40, 52, 30, 47].map((value, i) => ({ label: days[i], value })),
    },
    deadlines: [
      task("d1", "Design new landing page", "IN_PROGRESS", "HIGH", projects.web, at(1, 10), at(-3)),
      task("d2", "API integration", "TODO", "MEDIUM", projects.api, at(3), at(-4)),
      task("d3", "Project report", "TODO", "LOW", projects.marketing, at(5), at(-5)),
    ],
    activity: [
      { id: "a1", type: "TASK_COMPLETED", actor: "John", subject: "Fix login bug", createdAt: ago(2) },
      { id: "a2", type: "TASK_UPDATED", actor: "Sarah", subject: "Mobile App", createdAt: ago(4) },
      { id: "a3", type: "TASK_UPDATED", actor: "Mike", subject: "Content update", createdAt: ago(6) },
      { id: "a4", type: "TASK_CREATED", actor: "Anna", subject: "User testing", createdAt: ago(26) },
    ],
    recentTasks: [
      task("r1", "Review new designs", "IN_PROGRESS", "HIGH", projects.web, at(0), at(-1)),
      task("r2", "Fix login bug", "TODO", "HIGH", projects.mobile, at(0), at(-1)),
      task("r3", "Content update", "DONE", "MEDIUM", projects.marketing, at(-1), at(-2)),
      task("r4", "User testing", "IN_PROGRESS", "LOW", projects.mobile, at(-2), at(-3)),
    ],
    projects: [
      { ...projects.web, total: 20, done: 15, progress: 75 },
      { ...projects.mobile, total: 20, done: 9, progress: 45 },
      { ...projects.marketing, name: "Marketing Campaign", total: 10, done: 6, progress: 60 },
      { ...projects.api, total: 10, done: 9, progress: 90 },
    ],
  };
}

export function getDemoNotifications(now = new Date()): NotificationItem[] {
  const today = utcDayStart(now).getTime();
  return [
    { id: "n1", title: "Design new landing page", dueDate: new Date(today + DAY_MS + 10 * 3600 * 1000).toISOString(), overdue: false },
    { id: "n2", title: "Fix login bug", dueDate: new Date(today).toISOString(), overdue: false },
    { id: "n3", title: "Update onboarding copy", dueDate: new Date(today - 2 * DAY_MS).toISOString(), overdue: true },
  ];
}
export const demoProjects = Object.values(projects);
