import { prisma } from "@/lib/prisma";
import { DAY_MS, utcDayStart } from "@/lib/dates";
import { taskInclude, toTaskItem } from "@/lib/tasks";
import type { ChartPoint, DashboardData, NotificationItem, StatSummary } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function change(now: number, previous: number) {
  if (previous === 0) return now === 0 ? 0 : null;
  return Math.round(((now - previous) / previous) * 100);
}

function stat(now: number, previous: number): StatSummary {
  return { value: now, change: change(now, previous) };
}

function bucketByDay(dates: Date[], start: Date): ChartPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const dayStart = start.getTime() + i * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    return {
      label: WEEKDAYS[new Date(dayStart).getUTCDay()],
      value: dates.filter((d) => d.getTime() >= dayStart && d.getTime() < dayEnd).length,
    };
  });
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const now = new Date();
  const today = utcDayStart(now);
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const thisWeekStart = new Date(today.getTime() - 6 * DAY_MS);
  const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * DAY_MS);

  const [
    total,
    totalPrev,
    inProgress,
    inProgressPrev,
    completed,
    completedPrev,
    overdue,
    overduePrev,
    completions,
    deadlines,
    recentTasks,
    activity,
    projects,
  ] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, createdAt: { lt: weekAgo } } }),
    prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
    prisma.task.count({
      where: { userId, status: "IN_PROGRESS", createdAt: { lt: weekAgo } },
    }),
    prisma.task.count({ where: { userId, status: "DONE" } }),
    prisma.task.count({
      where: { userId, status: "DONE", completedAt: { lt: weekAgo } },
    }),
    prisma.task.count({
      where: { userId, status: { not: "DONE" }, dueDate: { lt: today } },
    }),
    prisma.task.count({
      where: {
        userId,
        createdAt: { lt: weekAgo },
        dueDate: { lt: utcDayStart(weekAgo) },
        OR: [{ status: { not: "DONE" } }, { completedAt: { gte: weekAgo } }],
      },
    }),
    prisma.task.findMany({
      where: { userId, completedAt: { gte: lastWeekStart } },
      select: { completedAt: true },
    }),
    prisma.task.findMany({
      where: { userId, status: { not: "DONE" }, dueDate: { gte: today } },
      orderBy: { dueDate: "asc" },
      take: 3,
      include: taskInclude,
    }),
    prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: taskInclude,
    }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: { tasks: { select: { status: true } } },
    }),
  ]);

  const completionDates = completions.map((t) => t.completedAt!);

  return {
    stats: {
      total: stat(total, totalPrev),
      inProgress: stat(inProgress, inProgressPrev),
      completed: stat(completed, completedPrev),
      overdue: stat(overdue, overduePrev),
    },
    chart: {
      thisWeek: bucketByDay(completionDates, thisWeekStart),
      lastWeek: bucketByDay(completionDates, lastWeekStart),
    },
    deadlines: deadlines.map(toTaskItem),
    recentTasks: recentTasks.map(toTaskItem),
    activity: activity.map((a) => ({
      id: a.id,
      type: a.type,
      actor: a.actor,
      subject: a.subject,
      createdAt: a.createdAt.toISOString(),
    })),
    projects: projects.map((p) => {
      const done = p.tasks.filter((t) => t.status === "DONE").length;
      const projectTotal = p.tasks.length;
      return {
        id: p.id,
        name: p.name,
        color: p.color,
        total: projectTotal,
        done,
        progress: projectTotal ? Math.round((done / projectTotal) * 100) : 0,
      };
    }),
  };
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  const now = new Date();
  const today = utcDayStart(now);
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { not: "DONE" },
      dueDate: { lt: new Date(today.getTime() + 2 * DAY_MS) },
    },
    orderBy: { dueDate: "asc" },
    take: 8,
    select: { id: true, title: true, dueDate: true },
  });
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    dueDate: t.dueDate!.toISOString(),
    overdue: t.dueDate!.getTime() < today.getTime(),
  }));
}
