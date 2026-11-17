import type { ReactNode } from "react";
import { Flower } from "./logo";
import { cx } from "./cx";

export function EmptyState({ title, children, action, className }: { title: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-3 rounded-card border border-dashed border-line-strong px-6 py-12 text-center", className)}>
      <Flower aria-hidden title="" className="size-8 text-brand/40" />
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="max-w-sm text-sm text-ink-muted">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
