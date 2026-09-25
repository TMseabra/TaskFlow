import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildTaskWhere } from "@/lib/task-query";
import { taskInclude, toTaskItem } from "@/lib/tasks";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/tasks/filter-bar";
import { TaskList } from "@/components/tasks/task-list";
import { NewTaskButton } from "@/components/tasks/new-task-button";

type SearchParams = Promise<{
  search?: string;
  status?: string;
  priority?: string;
  project?: string;
  open?: string;
}>;

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const userId = session!.user.id;
  const { open, ...filters } = await searchParams;

  const [tasks, linked] = await Promise.all([
    prisma.task.findMany({
      where: buildTaskWhere(userId, filters),
      orderBy: [{ createdAt: "desc" }],
      include: taskInclude,
    }),
    open
      ? prisma.task.findFirst({ where: { id: open, userId }, include: taskInclude })
      : Promise.resolve(null),
  ]);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}${hasFilters ? " matching your filters" : ""}`}
        action={<NewTaskButton />}
      />
      <FilterBar />
      <TaskList
        tasks={tasks.map(toTaskItem)}
        linkedTask={linked ? toTaskItem(linked) : null}
        hasFilters={hasFilters}
      />
    </div>
  );
}
