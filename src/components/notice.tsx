import type { ReactNode } from "react";
import { cx } from "./cx";
import type { Tone } from "./badge";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-sunken",
  brand: "border-brand/20 bg-brand-soft",
  success: "border-success/20 bg-success-soft",
  warning: "border-warning/25 bg-warning-soft",
  danger: "border-danger/20 bg-danger-soft",
};
const titles: Record<Tone, string> = {
  neutral: "text-ink",
  brand: "text-brand",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function Notice({ tone = "brand", title, children, action, className }: { tone?: Tone; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("flex flex-wrap items-start justify-between gap-3 rounded-field border p-4", tones[tone], className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className={cx("text-[15px] font-semibold", titles[tone])}>{title}</p>}
        {children && <div className="text-sm leading-relaxed text-ink">{children}</div>}
      </div>
      {action}
    </div>
  );
}
