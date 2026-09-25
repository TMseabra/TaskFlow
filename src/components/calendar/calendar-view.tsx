"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, EmptyState } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/button";
import { TaskDetailsModal } from "@/components/tasks/task-details-modal";
import { DAY_MS, formatDue, isOverdue } from "@/lib/dates";
import type { TaskItem } from "@/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthParam(year: number, month: number) {
  const d = new Date(Date.UTC(year, month, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function chipClass(task: TaskItem) {
  if (task.status === "DONE") return "bg-emerald-50 text-emerald-700 line-through dark:bg-emerald-500/10 dark:text-emerald-400";
  if (isOverdue(task.dueDate, task.status)) return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  if (task.status === "IN_PROGRESS") return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
}

export function CalendarView({
  year,
  month,
  gridStart,
  today,
  tasks,
}: {
  year: number;
  month: number;
  gridStart: string;
  today: string;
  tasks: TaskItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTask = tasks.find((t) => t.id === openId) ?? null;

  const start = new Date(gridStart).getTime();
  const todayMs = new Date(today).getTime();
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start + i * DAY_MS);
    const dayTasks = tasks.filter((t) => {
      const due = new Date(t.dueDate!).getTime();
      return due >= date.getTime() && due < date.getTime() + DAY_MS;
    });
    return { date, tasks: dayTasks, inMonth: date.getUTCMonth() === month };
  });

  const title = new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const monthDaysWithTasks = days.filter((d) => d.inMonth && d.tasks.length > 0);

  return (
    <Card padded={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${monthParam(year, month - 1)}`}
            aria-label="Previous month"
            className={buttonClass("secondary", "icon")}
          >
            <ChevronLeftIcon />
          </Link>
          <Link href="/calendar" className={buttonClass("secondary", "md")}>
            Today
          </Link>
          <Link
            href={`/calendar?month=${monthParam(year, month + 1)}`}
            aria-label="Next month"
            className={buttonClass("secondary", "icon")}
          >
            <ChevronRightIcon />
          </Link>
        </div>
      </div>

      <div className="hidden @3xl/main:block">
        <div className="grid grid-cols-7 border-b border-line bg-subtle">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map(({ date, tasks: dayTasks, inMonth }, i) => {
            const isToday = date.getTime() === todayMs;
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[118px] border-line p-2 ${i % 7 !== 6 ? "border-r" : ""} ${i < 35 ? "border-b" : ""} ${
                  inMonth ? "" : "bg-subtle/60"
                }`}
              >
                <span
                  className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday ? "bg-brand text-white" : inMonth ? "text-ink" : "text-muted"
                  }`}
                >
                  {date.getUTCDate()}
                </span>
                <ul className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(task.id)}
                        className={`block w-full truncate rounded-md px-2 py-1 text-left text-xs font-medium transition-opacity hover:opacity-80 ${chipClass(task)}`}
                      >
                        {task.title}
                      </button>
                    </li>
                  ))}
                  {dayTasks.length > 3 && (
                    <li className="px-2 text-xs text-muted">+{dayTasks.length - 3} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 @3xl/main:hidden">
        {monthDaysWithTasks.length === 0 ? (
          <EmptyState>No tasks due this month.</EmptyState>
        ) : (
          <ul className="space-y-5">
            {monthDaysWithTasks.map(({ date, tasks: dayTasks }) => (
              <li key={date.toISOString()}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })}
                </p>
                <ul className="space-y-2">
                  {dayTasks.map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(task.id)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 text-left hover:bg-subtle"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">{task.title}</span>
                          <span className="text-xs text-muted">{formatDue(task.dueDate!)}</span>
                        </span>
                        <StatusBadge status={task.status} />
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TaskDetailsModal key={openId ?? "none"} task={openTask} onClose={() => setOpenId(null)} />
    </Card>
  );
}
