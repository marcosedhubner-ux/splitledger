import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-paper text-ink-soft ring-ink/15",
  success: "bg-success-soft text-success ring-success/25",
  warning: "bg-warning-soft text-warning ring-warning/25",
  danger: "bg-danger-soft text-danger ring-danger/25",
  info: "bg-terracotta-soft text-terracotta ring-terracotta/25",
};

export function Badge({
  tone = "neutral",
  pulse,
  children,
}: {
  tone?: BadgeTone;
  /** Play a satisfying scale-pop, e.g. when the value it displays just changed.
   * Pair with a `key` on the Badge (e.g. keyed by the value) so React remounts
   * it and the animation replays. */
  pulse?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        pulse && "animate-badge-pop",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
