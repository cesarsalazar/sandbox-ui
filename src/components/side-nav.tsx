"use client";

import type { ElementType, ReactNode } from "react";
import { useId, useState, useSyncExternalStore } from "react";
import { ArrowUpRightIcon, ChevronDownIcon } from "./icons";
import { Logo } from "./logo";
import { cx } from "./cx";

// Navigation down the left side, for apps with more sections than fit across a
// TopBar (members, with its own pages, admin pages and links to the other
// apps). Small apps use the
// TopBar instead. Desktop and tablet only: on a phone, use the TabBar.
//
// From the top: the logo, the signed-in person (their own page), the sections,
// and at the bottom whatever ends a session. Sections that belong together
// (admin pages, links to other Sandbox apps) go in a SideNavGroup under a
// small heading. Put it in a SideNavLayout.
export function SideNav({
  home = "/",
  person,
  footer,
  children,
  as: LinkComponent = "a",
  className,
}: {
  home?: string;
  /** A SideNavItem with the person's avatar as its icon. */
  person?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <aside
      className={cx(
        "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r border-line bg-paper/70 backdrop-blur-xl backdrop-saturate-150 md:flex",
        className,
      )}
    >
      <div className="px-6 pt-6 pb-8">
        <LinkComponent href={home} className="inline-flex text-brand-ink">
          <Logo className="h-[22px] w-auto" />
        </LinkComponent>
      </div>
      {person && <div className="px-3 pb-1">{person}</div>}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">{children}</nav>
      {footer && <div className="flex flex-col gap-0.5 px-3 pt-4 pb-4">{footer}</div>}
    </aside>
  );
}

// Whether a group was left open or shut, kept per browser under its
// storageKey. Read after the page arrives, so the server's version and the
// first paint in the browser agree; null until then, or when nothing's kept.
const GROUP_EVENT = "sbx-side-nav-group";
function readGroup(key: string): boolean | null {
  try {
    const v = localStorage.getItem(key);
    return v === null ? null : v === "1";
  } catch {
    return null;
  }
}
function useGroupMemory(key?: string): [boolean | null, (open: boolean) => void] {
  const stored = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener(GROUP_EVENT, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(GROUP_EVENT, onChange);
      };
    },
    () => (key ? readGroup(key) : null),
    () => null,
  );
  // The choice made in this visit, for when the browser won't keep it.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const set = (open: boolean) => {
    setChosen(open);
    if (!key) return;
    try {
      localStorage.setItem(key, open ? "1" : "0");
    } catch {
      // Private browsing or blocked storage: it stays as chosen for this visit.
    }
    window.dispatchEvent(new Event(GROUP_EVENT));
  };
  return [chosen ?? stored, set];
}

// Sections that belong together, under a heading that opens and shuts them:
// an app's admin pages, links to the other Sandbox apps, pages for
// developers. Groups start open; one shut with `defaultOpen={false}` still
// opens when it holds the current page (`active`). With a `storageKey`, each
// browser remembers how the person left it. Its items are SideNavItems.
export function SideNavGroup({
  label,
  active = false,
  defaultOpen = true,
  storageKey,
  children,
}: {
  label: ReactNode;
  /** The current page is one of its items. */
  active?: boolean;
  defaultOpen?: boolean;
  /** Where this browser keeps it open or shut, e.g. "members.nav.admin". */
  storageKey?: string;
  children: ReactNode;
}) {
  const id = useId();
  const [remembered, remember] = useGroupMemory(storageKey);
  const open = remembered ?? (active || defaultOpen);
  return (
    <div className="mt-3 flex flex-col gap-0.5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        id={`${id}-label`}
        onClick={() => remember(!open)}
        className="flex h-7 items-center gap-1 rounded-full px-3 text-left text-xs font-medium text-ink-faint transition-colors hover:text-ink-muted"
      >
        {label}
        <ChevronDownIcon size={14} className={cx("transition-transform", !open && "-rotate-90")} />
      </button>
      <div id={id} role="group" aria-labelledby={`${id}-label`} hidden={!open} className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
}

// One section. `icon` is 18px (an avatar for the person's own row); every
// label starts on the same line. Sub-pages, as SideNavSubItems, show under
// the active section. Without `href` it's a button (Log out). `external`
// is another Sandbox app: it opens in a new tab, marked with an arrow.
export function SideNavItem({
  href,
  icon,
  active = false,
  external = false,
  onClick,
  as: LinkComponent = "a",
  children,
  subItems,
}: {
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  as?: ElementType;
  children: ReactNode;
  subItems?: ReactNode;
}) {
  const Component = !href ? "button" : external ? "a" : LinkComponent;
  return (
    <div>
      <Component
        href={href}
        onClick={onClick}
        type={href ? undefined : "button"}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-current={active ? "page" : undefined}
        className={cx(
          "group/item flex h-9 w-full items-center gap-3 rounded-full px-3 text-left text-[15px] transition-colors",
          active ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-muted hover:bg-sunken hover:text-ink",
        )}
      >
        {icon && <span className="flex w-6 shrink-0 justify-center">{icon}</span>}
        <span className="truncate">{children}</span>
        {external && (
          <>
            <ArrowUpRightIcon size={14} className="ml-auto shrink-0 text-ink-faint group-hover/item:text-ink-muted" />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </Component>
      {active && subItems && <div className="mt-1 flex flex-col gap-0.5">{subItems}</div>}
    </div>
  );
}

export function SideNavSubItem({
  href,
  active = false,
  as: LinkComponent = "a",
  children,
}: {
  href: string;
  active?: boolean;
  as?: ElementType;
  children: ReactNode;
}) {
  return (
    <LinkComponent
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "block rounded-full py-1.5 pr-3 pl-12 text-sm transition-colors",
        active ? "bg-sunken font-medium text-ink" : "text-ink-muted hover:bg-sunken hover:text-ink",
      )}
    >
      {children}
    </LinkComponent>
  );
}

// The page beside a SideNav: shifted clear of it on desktop, full width on a
// phone. `width` is the content column: "narrow" for a profile or a form,
// "wide" for directories and tables.
export function SideNavLayout({
  nav,
  width = "wide",
  children,
}: {
  nav: ReactNode;
  width?: "narrow" | "default" | "wide";
  children: ReactNode;
}) {
  const max = { narrow: "max-w-2xl", default: "max-w-4xl", wide: "max-w-6xl" }[width];
  return (
    <>
      {nav}
      <main className="md:pl-60">
        <div className={cx("mx-auto w-full px-5 pt-6 pb-32 md:px-12 md:pt-14 md:pb-16", max)}>{children}</div>
      </main>
    </>
  );
}
