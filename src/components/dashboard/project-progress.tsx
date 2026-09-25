import Link from "next/link";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import type { ProjectProgressItem } from "@/types";

export function ProgressBar({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-line/60"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="animate-grow-x h-full rounded-full bg-gradient-to-r from-brand to-[#2bd98a]"
        style={{ width: `${value}%`, animationDelay: `${delay}ms` }}
      />
    </div>
  );
}

export function ProjectProgress({ projects }: { projects: ProjectProgressItem[] }) {
  return (
    <Card>
      <CardHeader title="Project progress" href="/projects" />
      {projects.length === 0 ? (
        <EmptyState>
          <span>
            No projects yet.{" "}
            <Link href="/projects" className="font-semibold text-brand hover:text-brand-hover">
              Create one
            </Link>
          </span>
        </EmptyState>
      ) : (
        <ul className="space-y-5">
          {projects.slice(0, 5).map((project, i) => (
            <li key={project.id}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-ink">{project.name}</span>
                <span className="shrink-0 font-semibold text-ink">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} delay={i * 80} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
