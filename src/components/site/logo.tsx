export function Logo({
  iconSize = 26,
  textClassName = "text-[22px]",
}: {
  iconSize?: number;
  textClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        style={{ width: iconSize, height: iconSize, borderWidth: Math.max(2, Math.round(iconSize / 9)) }}
        className="flex shrink-0 items-center justify-center rounded-[7px] border-solid border-brand text-brand"
        aria-hidden="true"
      >
        <svg
          width={Math.round(iconSize * 0.62)}
          height={Math.round(iconSize * 0.62)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />
        </svg>
      </span>
      <span
        className={`whitespace-nowrap font-extrabold lowercase leading-none tracking-[-0.02em] text-brand-ink ${textClassName}`}
      >
        task<span className="text-brand">flow</span>
      </span>
    </span>
  );
}
