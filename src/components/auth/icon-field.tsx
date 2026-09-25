import type { ReactNode, InputHTMLAttributes } from "react";

type IconFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  label: string;
};

export function IconField({ icon, label, id, ...props }: IconFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-base font-medium text-body"
      >
        {label}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted transition-colors group-focus-within:text-brand dark:group-focus-within:text-white">
          {icon}
        </span>
        <input
          id={id}
          {...props}
          className="w-full rounded-lg border border-line bg-card py-3 pl-11 pr-4 text-base text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      </div>
    </div>
  );
}
