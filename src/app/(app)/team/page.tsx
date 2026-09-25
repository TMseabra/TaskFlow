import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utcDayStart } from "@/lib/dates";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ActivityList } from "@/components/dashboard/activity-card";
import { ProgressBar } from "@/components/dashboard/project-progress";

type Member = { name: string; isYou: boolean; total: number; done: number; inProgress: number; overdue: number };

export default async function TeamPage() {
  const session = await auth();
  const userId = session!.user.id;
  const yourName = session!.user.name?.trim() || "You";
  const today = utcDayStart(new Date());

  const [tasks, activity] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      select: { assignee: true, status: true, dueDate: true },
    }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const members = new Map<string, Member>();
  members.set(yourName.toLowerCase(), { name: yourName, isYou: true, total: 0, done: 0, inProgress: 0, overdue: 0 });

  for (const task of tasks) {
    const name = task.assignee?.trim() || yourName;
    const key = name.toLowerCase();
    const member =
      members.get(key) ?? { name, isYou: false, total: 0, done: 0, inProgress: 0, overdue: 0 };
    member.total++;
    if (task.status === "DONE") member.done++;
    if (task.status === "IN_PROGRESS") member.inProgress++;
    if (task.status !== "DONE" && task.dueDate && task.dueDate < today) member.overdue++;
    members.set(key, member);
  }

  const list = [...members.values()].sort((a, b) => Number(b.isYou) - Number(a.isYou) || b.total - a.total);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="People on your tasks. Add someone by setting them as a task's assignee."
      />

      <ul className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {list.map((m) => {
          const rate = m.total ? Math.round((m.done / m.total) * 100) : 0;
          return (
            <li key={m.name} className="rounded-2xl border border-line bg-card p-5">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} size={44} color={m.isYou ? "#00C96B" : undefined} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {m.name}
                    {m.isYou && <span className="ml-2 rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-medium text-brand">You</span>}
                  </p>
                  <p className="text-xs text-muted">
                    {m.total} {m.total === 1 ? "task" : "tasks"} assigned
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-body">Completion</span>
                  <span className="font-semibold text-ink">{rate}%</span>
                </div>
                <ProgressBar value={rate} />
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-subtle p-3 text-center">
                {[
                  ["Active", m.inProgress],
                  ["Done", m.done],
                  ["Overdue", m.overdue],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</dt>
                    <dd className="mt-0.5 text-lg font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>

      <Card>
        <CardHeader title="Recent activity" />
        {activity.length === 0 ? (
          <EmptyState>No activity yet.</EmptyState>
        ) : (
          <ActivityList
            items={activity.map((a) => ({
              id: a.id,
              type: a.type,
              actor: a.actor,
              subject: a.subject,
              createdAt: a.createdAt.toISOString(),
            }))}
          />
        )}
      </Card>
    </div>
  );
}
