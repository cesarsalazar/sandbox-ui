import type { ReactNode } from "react";
import { Logo } from "./logo";
import { cx } from "./cx";

// The page column. "narrow" suits forms; "wide" suits tables.
export function Container({ size = "default", className, children }: { size?: "narrow" | "default" | "wide"; className?: string; children: ReactNode }) {
  const max = { narrow: "max-w-2xl", default: "max-w-4xl", wide: "max-w-6xl" }[size];
  return <div className={cx("mx-auto w-full px-4 sm:px-6", max, className)}>{children}</div>;
}

// The bar across the top of every Sandbox app: the logo and the app's name,
// then navigation, then whatever goes on the right (usually the person).
export function TopBar({ appName, home = "/", nav, end, className }: { appName?: ReactNode; home?: string; nav?: ReactNode; end?: ReactNode; className?: string }) {
  return (
    <header className={cx("border-b border-line bg-paper/90 backdrop-blur", className)}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href={home} className="flex shrink-0 items-center gap-3 text-brand-ink">
          <Logo className="h-[18px] w-auto" />
          {appName && <span className="border-l border-line-strong pl-3 text-[15px] font-medium text-ink">{appName}</span>}
        </a>
        {nav && <nav className="ml-2 hidden items-center gap-1 md:flex">{nav}</nav>}
        <div className="ml-auto flex items-center gap-3">{end}</div>
      </div>
    </header>
  );
}

export function NavLink({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx("rounded-full px-3 py-1.5 text-sm transition-colors", active ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-muted hover:text-ink")}
    >
      {children}
    </a>
  );
}

// Label and value pairs, such as a profile's details: one per line, the label
// above its value, between hairlines. Never in columns; a reader scans down.
export function DetailList({ items, className }: { items: { label: ReactNode; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cx("divide-y divide-line", className)}>
      {items.map((it, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
          <dt className="text-sm text-ink-muted">{it.label}</dt>
          <dd className="text-base break-words text-ink">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
