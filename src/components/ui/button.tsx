import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

const variants = {
  primary: "bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-hover hover:shadow-md hover:shadow-brand/25",
  dark: "bg-navy text-white hover:bg-[#1c2638] dark:bg-white dark:text-navy dark:hover:bg-gray-100",
  secondary: "border border-line bg-card text-ink hover:border-[#d5dae0] hover:bg-subtle dark:hover:border-[#3a4552]",
  ghost: "text-body hover:bg-subtle hover:text-ink",
  danger: "border border-red-200 bg-card text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}
