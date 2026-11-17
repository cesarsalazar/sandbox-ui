import type { ReactNode } from "react";
import { cx } from "./cx";

// The top of a page: a small label, the title, a line of explanation, and
// actions on the right. "display" sets the title in Instrument Serif: keep it
// for the one headline of a landmark moment, such as a welcome page.
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  display = false,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  display?: boolean;
  className?: string;
}) {
  return (
    <header className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow && <p className="text-sm font-medium text-brand-ink">{eyebrow}</p>}
        <h1 className={cx(display ? "font-serif text-5xl leading-[1.02] sm:text-6xl" : "text-3xl font-semibold tracking-tight sm:text-[34px]", "text-ink")}>{title}</h1>
        {description && <p className="text-[17px] leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
