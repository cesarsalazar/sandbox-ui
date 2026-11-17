import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export function Card({ className, padded = true, ...props }: { padded?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("rounded-card border border-line bg-surface shadow-card", padded && "p-5 sm:p-6", className)} {...props} />;
}

// A titled block inside a page or card.
export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {description && <p className="text-sm text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx("border-line", className)} />;
}
