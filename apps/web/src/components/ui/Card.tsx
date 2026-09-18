import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-ink/[0.06] bg-surface p-5 shadow-[0_2px_12px_rgba(36,31,26,0.08)]",
        className
      )}
      {...props}
    />
  );
}
