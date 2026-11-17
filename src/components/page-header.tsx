import type { ReactNode } from "react";
import { cx } from "./cx";

// The top of a page: a small label, the title in the serif, a line of
// explanation, and actions on the right.
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow && <p className="text-sm font-medium text-brand">{eyebrow}</p>}
        <h1 className="font-serif text-[40px] leading-[1.05] text-ink sm:text-5xl">{title}</h1>
        {description && <p className="text-[17px] leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
