import { CheckIcon } from "@/components/ui/icons";

export function TaskCheckbox({
  checked,
  label,
  onToggle,
  disabled,
}: {
  checked: boolean;
  label: string;
  onToggle?: () => void;
  disabled?: boolean;
}) {
  const box = `flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150 ${
    checked ? "border-brand bg-brand text-white" : "border-[#c9d0d8] bg-card dark:border-[#3a4552]"
  }`;

  if (!onToggle) {
    return (
      <span className={box} aria-hidden="true">
        {checked && <CheckIcon width={12} height={12} strokeWidth={3} />}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? `Mark "${label}" as not done` : `Mark "${label}" as done`}
      disabled={disabled}
      onClick={onToggle}
      className={`${box} hover:border-brand disabled:opacity-60`}
    >
      {checked && <CheckIcon width={12} height={12} strokeWidth={3} />}
    </button>
  );
}
