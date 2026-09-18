import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-terracotta text-white hover:bg-terracotta/90 disabled:bg-terracotta/40",
  secondary: "bg-surface text-ink ring-1 ring-inset ring-ink/15 hover:bg-paper",
  ghost: "text-ink-soft hover:bg-paper",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
