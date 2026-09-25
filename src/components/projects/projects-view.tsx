"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { CheckIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/dashboard/project-progress";
import type { ProjectProgressItem } from "@/types";

const colors = ["#00C96B", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#EF4444", "#101827"];

type ProjectCardItem = ProjectProgressItem & { inProgress: number };

export function NewProjectButton() {
  const router = useRouter();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function close() {
    setOpen(false);
    setName("");
    setColor(colors[0]);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    }).catch(() => null);
    setSaving(false);
    if (!res?.ok) {
      const data = res ? await res.json().catch(() => ({})) : {};
      setError(data.error ?? "Could not create the project.");
      return;
    }
    close();
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon width={17} height={17} />
        New project
      </Button>
      <Modal open={open} onClose={close} title="Create project" description="Projects help you group related tasks.">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor={`${uid}-name`} className="block text-sm font-medium text-ink">
              Project name
            </label>
            <input
              id={`${uid}-name`}
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="mt-1.5 h-10 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-ink">Color</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white ring-offset-2 ring-offset-card transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-ink/30"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <CheckIcon width={14} height={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create project"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function ProjectGrid({ projects }: { projects: ProjectCardItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<ProjectCardItem | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    const res = await fetch(`/api/projects/${deleting.id}`, { method: "DELETE" }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      setDeleting(null);
      router.refresh();
    }
  }

  if (projects.length === 0) {
    return <EmptyState>No projects yet. Create one to start grouping your tasks.</EmptyState>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {projects.map((project, i) => (
          <li
            key={project.id}
            className="flex flex-col rounded-2xl border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,24,39,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                >
                  {project.name[0]?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-ink">{project.name}</h2>
                  <p className="text-xs text-muted">
                    {project.total} {project.total === 1 ? "task" : "tasks"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleting(project)}
                aria-label={`Delete project ${project.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <TrashIcon width={16} height={16} />
              </button>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-body">Progress</span>
                <span className="font-semibold text-ink">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} delay={i * 60} />
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-subtle p-3 text-center">
              {[
                ["To do", project.total - project.done - project.inProgress],
                ["Active", project.inProgress],
                ["Done", project.done],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/tasks?project=${project.id}`}
              className="mt-4 text-sm font-semibold text-brand hover:text-brand-hover"
            >
              View tasks →
            </Link>
          </li>
        ))}
      </ul>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete project?"
        description={
          deleting
            ? `“${deleting.name}” will be deleted. Its tasks are kept and moved to “No project”.`
            : undefined
        }
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={busy} onClick={confirmDelete}>
            Delete project
          </Button>
        </div>
      </Modal>
    </>
  );
}
