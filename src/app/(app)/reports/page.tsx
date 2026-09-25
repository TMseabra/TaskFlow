import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAY_MS, utcDayStart } from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { TaskChart } from "@/components/dashboard/task-chart";
import { statusLabels, priorityLabels } from "@/components/ui/badge";

const statusColors = { TODO: "#3B82F6", IN_PROGRESS: "#F59E0B", DONE: "#00C96B" };
const priorityColors = { HIGH: "#EF4444", MEDIUM: "#F59E0B", LOW: "#00C96B" };

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm font-medium text-body">{label}</p>
      <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-ink">{value}</p>
      <p className="mt-3 text-xs text-muted">{hint}</p>
    </div>
  );
}

function BarList({ rows, total }: { rows: { label: string; value: number; color: string }[]; total: number }) {
  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const pct = total ? Math.round((row.value / total) * 100) : 0;
        return (
          <li key={row.label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-body">{row.label}</span>
              <span className="font-medium text-ink">
                {row.value} <span className="text-muted">· {pct}%</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-subtle">
              <div
                className="animate-grow-x h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: row.color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function ReportsPage() {
  const session = await auth();
  const userId = session!.user.id;
  const today = utcDayStart(new Date());
  const weeksStart = new Date(today.getTime() - (8 * 7 - 1) * DAY_MS);
  const monthAgo = new Date(today.getTime() - 30 * DAY_MS);

  const tasks = await prisma.task.findMany({
    where: { userId },
    select: {
      status: true,
      priority: true,
      dueDate: true,
      completedAt: true,
      project: { select: { id: true, name: true, color: true } },
    },
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const overdue = tasks.filter((t) => t.status !== "DONE" && t.dueDate && t.dueDate < today).length;
  const completedRecently = tasks.filter((t) => t.completedAt && t.completedAt >= monthAgo).length;

  const weekly = Array.from({ length: 8 }, (_, i) => {
    const start = weeksStart.getTime() + i * 7 * DAY_MS;
    const end = start + 7 * DAY_MS;
    return {
      label: new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      value: tasks.filter((t) => t.completedAt && t.completedAt.getTime() >= start && t.completedAt.getTime() < end).length,
    };
  });
  const weeklyAvg = weekly.reduce((s, w) => s + w.value, 0) / weekly.length;

  const byProject = new Map<string, { name: string; color: string; total: number; done: number }>();
  for (const t of tasks) {
    const key = t.project?.id ?? "none";
    const row = byProject.get(key) ?? {
      name: t.project?.name ?? "No project",
      color: t.project?.color ?? "#9AA6B2",
      total: 0,
      done: 0,
    };
    row.total++;
    if (t.status === "DONE") row.done++;
    byProject.set(key, row);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="How your work is going over time" />

      <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @3xl/main:grid-cols-4">
        <Kpi label="Completion rate" value={`${total ? Math.round((done / total) * 100) : 0}%`} hint={`${done} of ${total} tasks done`} />
        <Kpi label="Completed (30 days)" value={String(completedRecently)} hint="Tasks finished in the last 30 days" />
        <Kpi label="Weekly average" value={weeklyAvg.toFixed(1)} hint="Completed per week, last 8 weeks" />
        <Kpi label="Overdue" value={String(overdue)} hint="Open tasks past their due date" />
      </div>

      <Card>
        <CardHeader title="Completed per week" />
        <TaskChart data={weekly} seriesLabel="Tasks completed" />
      </Card>

      <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2">
        <Card>
          <CardHeader title="Tasks by status" />
          <BarList
            total={total}
            rows={(["TODO", "IN_PROGRESS", "DONE"] as const).map((s) => ({
              label: statusLabels[s],
              value: tasks.filter((t) => t.status === s).length,
              color: statusColors[s],
            }))}
          />
        </Card>
        <Card>
          <CardHeader title="Tasks by priority" />
          <BarList
            total={total}
            rows={(["HIGH", "MEDIUM", "LOW"] as const).map((p) => ({
              label: priorityLabels[p],
              value: tasks.filter((t) => t.priority === p).length,
              color: priorityColors[p],
            }))}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="By project" />
        {byProject.size === 0 ? (
          <EmptyState>No tasks yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="pb-3 font-semibold">Project</th>
                  <th scope="col" className="pb-3 text-right font-semibold">Tasks</th>
                  <th scope="col" className="pb-3 text-right font-semibold">Done</th>
                  <th scope="col" className="pb-3 text-right font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...byProject.values()].map((row) => (
                  <tr key={row.name}>
                    <td className="py-3">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                        {row.name}
                      </span>
                    </td>
                    <td className="py-3 text-right text-body">{row.total}</td>
                    <td className="py-3 text-right text-body">{row.done}</td>
                    <td className="py-3 text-right font-semibold text-ink">
                      {row.total ? Math.round((row.done / row.total) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
