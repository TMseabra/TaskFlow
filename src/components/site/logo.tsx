export function Logo({
  size = 56,
  textClassName = "text-3xl",
}: {
  size?: number;
  textClassName?: string;
}) {
  const iconSize = Math.round(size * 0.45);
  return (
    <span className="flex items-center gap-2 sm:gap-3">
      <span
        style={{ width: iconSize, height: iconSize, borderWidth: 3 }}
        className="flex shrink-0 items-center justify-center rounded-md border-solid border-[#00c96b] text-[#00c96b]"
      >
        <svg
          width={Math.round(iconSize * 0.6)}
          height={Math.round(iconSize * 0.6)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 12 9 17 20 6" />
        </svg>
      </span>
      <span className={`font-extrabold tracking-tight lowercase ${textClassName}`}>
        <span className="text-[#07585c] dark:text-[#3ddc9a]">task</span>
        <span className="text-[#00c96b]">flow</span>
      </span>
    </span>
  );
}
