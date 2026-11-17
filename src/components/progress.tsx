import type { ReactNode } from "react";
import { cx } from "./cx";

// A bar filling towards a goal, with the count beside its label.
export function Progress({ value, max, label, className }: { value: number; max: number; label?: ReactNode; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-medium text-ink">{label}</span>
          <span className="tabular font-mono text-ink-muted">
            {value} / {max}
          </span>
        </div>
      )}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-2 overflow-hidden rounded-full bg-sunken">
        <div className={cx("h-full rounded-full transition-[width]", pct >= 100 ? "bg-success" : "bg-brand")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export type StepState = "done" | "current" | "upcoming";

// Numbered steps of a process. Horizontal from the sm breakpoint up, stacked
// on phones.
export function Steps({ steps, className }: { steps: { label: ReactNode; detail?: ReactNode; state: StepState }[]; className?: string }) {
  return (
    <ol className={cx("flex flex-col gap-3 sm:flex-row sm:gap-0", className)}>
      {steps.map((s, i) => (
        <li key={i} aria-current={s.state === "current" ? "step" : undefined} className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-2">
          <div className="flex items-center sm:w-full">
            <span
              className={cx(
                "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                s.state === "done" && "border-brand bg-brand text-on-brand",
                s.state === "current" && "border-brand bg-brand-soft text-brand-ink",
                s.state === "upcoming" && "border-line-strong bg-surface text-ink-faint",
              )}
            >
              {s.state === "done" ? (
                <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            {i < steps.length - 1 && <span aria-hidden className={cx("mx-3 hidden h-px flex-1 sm:block", s.state === "done" ? "bg-brand" : "bg-line-strong")} />}
          </div>
          <div className="flex flex-col sm:pr-4">
            <span className={cx("text-sm font-medium", s.state === "upcoming" ? "text-ink-muted" : "text-ink")}>{s.label}</span>
            {s.detail && <span className="text-sm text-ink-muted">{s.detail}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
