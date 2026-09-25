"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { TaskChart } from "@/components/dashboard/task-chart";
import type { DashboardData } from "@/types";

const ranges = [
  { value: "thisWeek", label: "This week" },
  { value: "lastWeek", label: "Last week" },
];

export function TaskOverviewCard({ chart }: { chart: DashboardData["chart"] }) {
  const [range, setRange] = useState<"thisWeek" | "lastWeek">("thisWeek");
  const data = chart[range];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader
        title="Task overview"
        action={
          <Select
            size="sm"
            label="Chart range"
            className="w-32"
            value={range}
            onChange={(v) => setRange(v as typeof range)}
            options={ranges}
            placeholder="This week"
          />
        }
      />
      <p className="-mt-3 mb-4 text-sm text-muted">
        <span className="font-semibold text-ink">{total}</span> tasks completed{" "}
        {range === "thisWeek" ? "in the last 7 days" : "the week before"}
      </p>
      <TaskChart data={data} seriesLabel="Tasks completed" />
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
        <span className="h-0.5 w-4 rounded-full bg-brand" />
        Tasks completed
      </div>
    </Card>
  );
}
