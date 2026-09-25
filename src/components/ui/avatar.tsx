const palette = ["#00C96B", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#EF4444"];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

export function Avatar({
  name,
  size = 36,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        backgroundColor: color ?? colorFor(name),
      }}
    >
      {initials(name)}
    </span>
  );
}
