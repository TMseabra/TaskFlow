// Due dates are stored as floating wall-clock times (the time the user typed, saved as UTC)
// and always formatted in UTC, so server and browser render the same day.

export const DAY_MS = 24 * 60 * 60 * 1000;

export function utcDayStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatDate(iso: string, withYear = true) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

export function hasTime(iso: string) {
  const d = new Date(iso);
  return d.getUTCHours() !== 0 || d.getUTCMinutes() !== 0;
}

export function formatDue(iso: string, now = new Date()) {
  const date = new Date(iso);
  const diff = Math.round(
    (utcDayStart(date).getTime() - utcDayStart(now).getTime()) / DAY_MS
  );
  const sameYear = date.getUTCFullYear() === now.getUTCFullYear();
  const day =
    diff === 0
      ? "Today"
      : diff === 1
      ? "Tomorrow"
      : diff === -1
      ? "Yesterday"
      : formatDate(iso, !sameYear);
  if (!hasTime(iso)) return day;
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
  return `${day}, ${time}`;
}

export function timeAgo(iso: string, now = new Date()) {
  const seconds = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(iso, false);
}

export function toDateTimeInput(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function fromDateTimeInput(value: string) {
  return value ? `${value}:00.000Z` : null;
}

export function isOverdue(dueDate: string | null, status: string, now = new Date()) {
  return (
    !!dueDate &&
    status !== "DONE" &&
    new Date(dueDate).getTime() < utcDayStart(now).getTime()
  );
}
