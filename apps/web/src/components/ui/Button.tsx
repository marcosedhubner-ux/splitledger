import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-white shadow-[0_1px_2px_rgba(217,96,63,0.25)] hover:bg-terracotta/90 hover:shadow-[0_6px_20px_rgba(217,96,63,0.38)] disabled:bg-terracotta/40 disabled:shadow-none",
  secondary:
    "bg-surface text-ink ring-1 ring-inset ring-ink/15 hover:bg-paper hover:ring-ink/25 hover:shadow-[0_4px_14px_rgba(36,31,26,0.1)]",
  ghost: "text-ink-soft hover:bg-paper hover:text-ink",
  danger:
    "bg-danger text-white shadow-[0_1px_2px_rgba(156,58,42,0.25)] hover:bg-danger/90 hover:shadow-[0_6px_20px_rgba(156,58,42,0.35)] disabled:bg-danger/40 disabled:shadow-none",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
        "transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "active:scale-[0.96] active:duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:cursor-not-allowed disabled:active:scale-100",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
