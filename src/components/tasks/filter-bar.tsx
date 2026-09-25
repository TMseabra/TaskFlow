"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWorkspace } from "@/components/app/workspace-context";
import { Select } from "@/components/ui/select";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { priorityOptions, statusOptions } from "@/components/tasks/task-form";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { projects } = useWorkspace();
  const urlSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(urlSearch);
  const [lastUrlSearch, setLastUrlSearch] = useState(urlSearch);

  // Keep the input in sync when the URL changes from elsewhere (e.g. the global search bar).
  if (urlSearch !== lastUrlSearch) {
    setLastUrlSearch(urlSearch);
    if (urlSearch !== search.trim()) setSearch(urlSearch);
  }

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("open");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (search.trim() === urlSearch) return;
    const timeout = setTimeout(() => setParam("search", search.trim()), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = ["search", "status", "priority", "project"].some((k) => searchParams.get(k));

  return (
    <div className="flex flex-col gap-3 @3xl/main:flex-row @3xl/main:items-center">
      <div className="relative flex-1">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <SearchIcon
          width={17}
          height={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id="task-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, description, project or assignee..."
          className="h-10 w-full rounded-lg border border-line bg-card pl-10 pr-3 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 @xl/main:grid-cols-3 @3xl/main:flex">
        <Select
          className="@3xl/main:w-40"
          label="Filter by status"
          value={searchParams.get("status") ?? ""}
          onChange={(v) => setParam("status", v)}
          options={[{ value: "", label: "All statuses" }, ...statusOptions]}
          placeholder="All statuses"
        />
        <Select
          className="@3xl/main:w-40"
          label="Filter by priority"
          value={searchParams.get("priority") ?? ""}
          onChange={(v) => setParam("priority", v)}
          options={[{ value: "", label: "All priorities" }, ...priorityOptions]}
          placeholder="All priorities"
        />
        <Select
          className="col-span-2 @xl/main:col-span-1 @3xl/main:w-44"
          label="Filter by project"
          value={searchParams.get("project") ?? ""}
          onChange={(v) => setParam("project", v)}
          options={[
            { value: "", label: "All projects" },
            { value: "none", label: "No project" },
            ...projects.map((p) => ({ value: p.id, label: p.name, dotColor: p.color })),
          ]}
          placeholder="All projects"
        />
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.replace(pathname, { scroll: false });
          }}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted hover:bg-subtle hover:text-ink"
        >
          <CloseIcon width={15} height={15} />
          Clear
        </button>
      )}
    </div>
  );
}
