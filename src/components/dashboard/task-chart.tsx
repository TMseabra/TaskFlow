"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChartPoint } from "@/types";

const HEIGHT = 250;
const PAD = { top: 14, right: 16, bottom: 30, left: 38 };

function niceScale(max: number) {
  const raw = Math.max(max, 1) / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? 10 * pow;
  const niceStep = Math.max(1, step);
  return { step: niceStep, max: niceStep * 5 };
}

function monotonePath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0].x},${pts[0].y}`;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1].y - pts[i].y) / (pts[i + 1].x - pts[i].x));
  const t = new Array<number>(n);
  t[0] = d[0];
  t[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / d[i];
    const b = t[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * d[i];
      t[i + 1] = k * b * d[i];
    }
  }
  let path = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = (pts[i + 1].x - pts[i].x) / 3;
    path += ` C${(pts[i].x + h).toFixed(1)},${(pts[i].y + t[i] * h).toFixed(1)} ${(pts[i + 1].x - h).toFixed(1)},${(pts[i + 1].y - t[i + 1] * h).toFixed(1)} ${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`;
  }
  return path;
}

export function TaskChart({
  data,
  seriesLabel = "Tasks",
}: {
  data: ChartPoint[];
  seriesLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { step, max } = niceScale(Math.max(0, ...data.map((d) => d.value)));
  const innerW = Math.max(1, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const inset = Math.min(18, innerW / 20);
  const stepX = data.length > 1 ? (innerW - inset * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: PAD.left + inset + i * stepX,
    y: PAD.top + innerH - (d.value / max) * innerH,
  }));
  const line = monotonePath(points);
  const baseline = PAD.top + innerH;
  const area =
    points.length > 1
      ? `${line} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`
      : "";

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    points.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(points[nearest].x - x)) nearest = i;
    });
    setHover(nearest);
  }

  const active = hover !== null ? points[hover] : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="block max-w-full touch-none"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C96B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00C96B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 6 }, (_, i) => {
          const value = i * step;
          const y = PAD.top + innerH - (value / max) * innerH;
          return (
            <g key={value}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--tf-line)"
                strokeDasharray={i === 0 ? undefined : "3 4"}
              />
              <text x={PAD.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="var(--tf-muted)">
                {value}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => (
          <text
            key={`${d.label}-${i}`}
            x={points[i].x}
            y={HEIGHT - 8}
            textAnchor="middle"
            fontSize="11"
            fill={hover === i ? "var(--tf-ink)" : "var(--tf-muted)"}
          >
            {d.label}
          </text>
        ))}

        {area && <path d={area} fill={`url(#${gradientId})`} />}
        <path d={line} fill="none" stroke="#00C96B" strokeWidth={2.5} strokeLinecap="round" />

        {active && (
          <line x1={active.x} x2={active.x} y1={PAD.top} y2={baseline} stroke="#00C96B" strokeOpacity={0.35} strokeDasharray="4 4" />
        )}

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 5.5 : 3.5}
            fill="#00C96B"
            stroke="var(--tf-card)"
            strokeWidth={2}
            style={{ transition: "r 120ms ease-out" }}
          />
        ))}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-lg shadow-navy/10"
          style={{ left: active.x, top: active.y - 10 }}
        >
          <p className="font-medium text-muted">{data[hover].label}</p>
          <p className="mt-0.5 font-semibold text-ink">
            {data[hover].value} {seriesLabel.toLowerCase()}
          </p>
        </div>
      )}

      <table className="sr-only">
        <caption>{seriesLabel}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={`${d.label}-${i}`}>
              <th scope="row">{d.label}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
