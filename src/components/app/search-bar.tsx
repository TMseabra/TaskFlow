import { SearchIcon } from "@/components/ui/icons";

export function SearchBar({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/tasks" method="GET" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search tasks and projects
      </label>
      <SearchIcon
        width={17}
        height={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        name="search"
        placeholder="Search tasks, projects..."
        className="h-10 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
      />
    </form>
  );
}
