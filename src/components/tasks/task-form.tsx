"use client";

import { useId, useState } from "react";
import { useWorkspace } from "@/components/app/workspace-context";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { fromDateTimeInput, toDateTimeInput } from "@/lib/dates";
import type { PriorityValue, TaskItem, TaskStatusValue } from "@/types";

export const statusOptions = [
  { value: "TODO", label: "To do", dotColor: "#3B82F6" },
  { value: "IN_PROGRESS", label: "In progress", dotColor: "#F59E0B" },
  { value: "DONE", label: "Done", dotColor: "#00C96B" },
];

export const priorityOptions = [
  { value: "LOW", label: "Low", dotColor: "#00C96B" },
  { value: "MEDIUM", label: "Medium", dotColor: "#F59E0B" },
  { value: "HIGH", label: "High", dotColor: "#EF4444" },
];

type Values = {
  title: string;
  description: string;
  status: TaskStatusValue;
  priority: PriorityValue;
  dueDate: string;
  projectId: string;
  assignee: string;
};

function initialValues(task?: TaskItem, defaults?: Partial<Values>): Values {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "TODO",
    priority: task?.priority ?? "MEDIUM",
    dueDate: toDateTimeInput(task?.dueDate ?? null),
    projectId: task?.project?.id ?? "",
    assignee: task?.assignee ?? "",
    ...defaults,
  };
}

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10";
const labelClass = "block text-sm font-medium text-ink";

export function TaskForm({
  task,
  defaults,
  onSaved,
  onCancel,
}: {
  task?: TaskItem;
  defaults?: Partial<Values>;
  onSaved: (task: TaskItem) => void;
  onCancel: () => void;
}) {
  const { projects, assignees } = useWorkspace();
  const [values, setValues] = useState<Values>(() => initialValues(task, defaults));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const uid = useId();
  const isEdit = Boolean(task);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch(isEdit ? `/api/tasks/${task!.id}` : "/api/tasks", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
        dueDate: fromDateTimeInput(values.dueDate),
        projectId: values.projectId || null,
        assignee: values.assignee || null,
      }),
    }).catch(() => null);

    setSaving(false);

    if (!res || !res.ok) {
      const data = res ? await res.json().catch(() => ({})) : {};
      setError(data.error ?? "Could not save the task. Please try again.");
      return;
    }

    const { task: saved } = await res.json();
    onSaved(saved);
  }

  const projectOptions = [
    { value: "", label: "No project" },
    ...projects.map((p) => ({ value: p.id, label: p.name, dotColor: p.color })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${uid}-title`} className={labelClass}>
          Task name
        </label>
        <input
          id={`${uid}-title`}
          required
          maxLength={200}
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Review new designs"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-description`} className={labelClass}>
          Description
        </label>
        <textarea
          id={`${uid}-description`}
          rows={3}
          maxLength={2000}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Add more details..."
          className={`${inputClass} h-auto resize-none py-2.5`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className={labelClass}>Status</span>
          <Select
            className="mt-1.5"
            label="Status"
            value={values.status}
            onChange={(v) => set("status", v as TaskStatusValue)}
            options={statusOptions}
            placeholder="Status"
          />
        </div>
        <div>
          <span className={labelClass}>Priority</span>
          <Select
            className="mt-1.5"
            label="Priority"
            value={values.priority}
            onChange={(v) => set("priority", v as PriorityValue)}
            options={priorityOptions}
            placeholder="Priority"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-due`} className={labelClass}>
            Due date
          </label>
          <input
            id={`${uid}-due`}
            type="datetime-local"
            value={values.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <span className={labelClass}>Project</span>
          <Select
            className="mt-1.5"
            label="Project"
            value={values.projectId}
            onChange={(v) => set("projectId", v)}
            options={projectOptions}
            placeholder="No project"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-assignee`} className={labelClass}>
            Assignee
          </label>
          <input
            id={`${uid}-assignee`}
            list={`${uid}-assignees`}
            maxLength={80}
            value={values.assignee}
            onChange={(e) => set("assignee", e.target.value)}
            placeholder="Who is working on this?"
            className={inputClass}
          />
          <datalist id={`${uid}-assignees`}>
            {assignees.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
      </div>

      {error && (
        <p role="alert" className="animate-shake text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
