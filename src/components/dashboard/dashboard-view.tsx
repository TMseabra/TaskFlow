import { StatCard } from "@/components/dashboard/stat-card";
import { TaskOverviewCard } from "@/components/dashboard/task-overview-card";
import { DeadlineCard } from "@/components/dashboard/deadline-card";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { PageHeader } from "@/components/app/page-header";
import { ActivityIcon, AlertCircleIcon, CheckCircleIcon, ClipboardIcon } from "@/components/ui/icons";
import type { DashboardData } from "@/types";

export function DashboardView({ data, preview = false }: { data: DashboardData; preview?: boolean }) {
  const { stats } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your tasks and projects" action={<NewTaskButton />} />

      <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @3xl/main:grid-cols-4">
        <StatCard label="Total tasks" stat={stats.total} tone="green" icon={<ClipboardIcon width={21} height={21} />} />
        <StatCard label="In progress" stat={stats.inProgress} tone="blue" icon={<ActivityIcon width={21} height={21} />} />
        <StatCard label="Completed" stat={stats.completed} tone="green" icon={<CheckCircleIcon width={21} height={21} />} />
        <StatCard
          label="Overdue"
          stat={stats.overdue}
          tone="red"
          higherIsBetter={false}
          icon={<AlertCircleIcon width={21} height={21} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-[minmax(0,1fr)_300px] @6xl/main:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <TaskOverviewCard chart={data.chart} />
          <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <RecentTasks tasks={data.recentTasks} interactive={!preview} />
            <ProjectProgress projects={data.projects} />
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4 @2xl/main:grid-cols-2 @4xl/main:grid-cols-1">
          <DeadlineCard tasks={data.deadlines} />
          <ActivityCard items={data.activity} />
        </div>
      </div>
    </div>
  );
}
