import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAY_MS, utcDayStart } from "@/lib/dates";
import { taskInclude, toTaskItem } from "@/lib/tasks";
import { PageHeader } from "@/components/app/page-header";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { CalendarView } from "@/components/calendar/calendar-view";

function parseMonth(value: string | undefined, now: Date) {
  const match = value?.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const month = Number(match[2]) - 1;
    if (month >= 0 && month <= 11) return { year: Number(match[1]), month };
  }
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await auth();
  const { month: monthParam } = await searchParams;
  const now = new Date();
  const { year, month } = parseMonth(monthParam, now);

  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const offset = (firstOfMonth.getUTCDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth.getTime() - offset * DAY_MS);
  const gridEnd = new Date(gridStart.getTime() + 42 * DAY_MS);

  const tasks = await prisma.task.findMany({
    where: { userId: session!.user.id, dueDate: { gte: gridStart, lt: gridEnd } },
    orderBy: { dueDate: "asc" },
    include: taskInclude,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" subtitle="Your tasks by due date" action={<NewTaskButton />} />
      <CalendarView
        year={year}
        month={month}
        gridStart={gridStart.toISOString()}
        today={utcDayStart(now).toISOString()}
        tasks={tasks.map(toTaskItem)}
      />
    </div>
  );
}
