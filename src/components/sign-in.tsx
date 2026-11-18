import type { ReactNode } from "react";
import { Logo } from "./logo";
import { cx } from "./cx";

// The frame for signing in, as auth.sandbox.is draws its login: the logo over
// one centred card, and nothing else. No top bar, no footer, no way to wander
// off. The card is 24rem wide, its title 20px semibold and centred, as auth's.
// Every sign-in screen of every app uses this, so moving from an app to auth
// and back doesn't feel like arriving somewhere else.
//
// The app's name sits under the logo. The footer is for the quiet line under
// the card's content, such as a link to the other way of signing in.
export function SignInFrame({
  appName,
  title,
  description,
  footer,
  children,
  className,
}: {
  appName?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <main className={cx("flex min-h-dvh items-center justify-center px-4 py-6", className)}>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="h-7 w-auto text-brand-ink" />
          {appName && <p className="text-[15px] text-ink-muted">{appName}</p>}
        </div>
        <div className="rounded-card border border-line bg-surface p-7 shadow-card">
          <div className="mt-2 mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-xl leading-[1.3] font-semibold tracking-[-0.02em] text-ink">{title}</h1>
            {description && <p className="text-[15px] leading-relaxed text-ink-muted">{description}</p>}
          </div>
          <div className="flex flex-col gap-4">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
        </div>
      </div>
    </main>
  );
}

// A short list of places to go, one per row, for a screen that asks a
// question before anything else happens, such as "member or applicant?".
// Each row is a link, so choosing is one tap, and none of them looks like the
// main action: the main action comes on the next screen.
export function ChoiceLinks({ items, className }: { items: { href: string; label: ReactNode; description?: ReactNode }[]; className?: string }) {
  return (
    <ul className={cx("divide-y divide-line overflow-hidden rounded-field border border-line-strong", className)}>
      {items.map((it) => (
        <li key={it.href}>
          <a href={it.href} className="flex items-center gap-3 bg-surface p-4 transition-colors hover:bg-sunken">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-medium text-ink">{it.label}</span>
              {it.description && <span className="text-sm text-ink-muted">{it.description}</span>}
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
