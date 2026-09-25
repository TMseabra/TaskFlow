"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PriorityBadge, ProjectTag, StatusBadge } from "@/components/ui/badge";
import { CheckIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";
import { TaskForm } from "@/components/tasks/task-form";
import { useTaskActions } from "@/components/tasks/task-actions";
import { formatDate, formatDue, isOverdue } from "@/lib/dates";
import type { TaskItem } from "@/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

export type DetailsMode = "view" | "edit" | "delete";

export function TaskDetailsModal({
  task,
  initialMode = "view",
  onClose,
  onChanged,
  onDeleted,
}: {
  task: TaskItem | null;
  initialMode?: DetailsMode;
  onClose: () => void;
  onChanged?: (task: TaskItem) => void;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const { setStatus, remove } = useTaskActions();
  const [editing, setEditing] = useState(initialMode === "edit");
  const [confirmDelete, setConfirmDelete] = useState(initialMode === "delete");
  const [busy, setBusy] = useState(false);

  function close() {
    setEditing(false);
    setConfirmDelete(false);
    onClose();
  }

  async function toggleComplete() {
    if (!task) return;
    setBusy(true);
    const updated = await setStatus(task.id, task.status === "DONE" ? "TODO" : "DONE");
    setBusy(false);
    if (updated) onChanged?.(updated);
  }

  async function handleDelete() {
    if (!task) return;
    setBusy(true);
    const ok = await remove(task.id);
    setBusy(false);
    if (ok) {
      onDeleted?.(task.id);
      close();
    }
  }

  const overdue = task ? isOverdue(task.dueDate, task.status) : false;

  return (
    <Modal open={!!task} onClose={close} title={editing ? "Edit task" : "Task details"} size="lg">
      {task && editing && (
        <TaskForm
          task={task}
          onCancel={() => setEditing(false)}
          onSaved={(saved) => {
            onChanged?.(saved);
            setEditing(false);
            router.refresh();
          }}
        />
      )}

      {task && !editing && (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          <h3
            className={`mt-3 text-xl font-semibold text-ink ${task.status === "DONE" ? "line-through decoration-muted/60" : ""}`}
          >
            {task.title}
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-body">
            {task.description || <span className="text-muted">No description.</span>}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-line bg-subtle p-4">
            <Field label="Due date">
              {task.dueDate ? (
                <span className={overdue ? "font-medium text-red-600 dark:text-red-400" : ""}>
                  {formatDue(task.dueDate)}
                  {overdue && " · Overdue"}
                </span>
              ) : (
                <span className="text-muted">No due date</span>
              )}
            </Field>
            <Field label="Project">
              {task.project ? (
                <ProjectTag name={task.project.name} color={task.project.color} />
              ) : (
                <span className="text-muted">None</span>
              )}
            </Field>
            <Field label="Assignee">{task.assignee || <span className="text-muted">Unassigned</span>}</Field>
            <Field label="Created">{formatDate(task.createdAt)}</Field>
          </dl>

          {confirmDelete ? (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-500/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-700 dark:text-red-300">Delete this task permanently?</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" disabled={busy} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <TrashIcon width={16} height={16} />
                Delete
              </Button>
              <div className="flex flex-1 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="secondary" disabled={busy} onClick={toggleComplete}>
                  <CheckIcon width={16} height={16} />
                  {task.status === "DONE" ? "Reopen" : "Mark complete"}
                </Button>
                <Button onClick={() => setEditing(true)}>
                  <PencilIcon width={16} height={16} />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
