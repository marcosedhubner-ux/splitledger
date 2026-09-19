import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable for cards that sit inside a link/button — adds a gentle lift and
   * intensifying shadow on hover, like picking a receipt up off the table. */
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-ink/[0.06] bg-surface p-5 shadow-[0_2px_12px_rgba(36,31,26,0.08)]",
        interactive &&
          "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(36,31,26,0.14)] active:translate-y-0 active:scale-[0.99] active:duration-150",
        className
      )}
      {...props}
    />
  );
}
