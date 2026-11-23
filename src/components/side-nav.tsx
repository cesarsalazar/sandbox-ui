import type { ElementType, ReactNode } from "react";
import { ArrowUpRightIcon } from "./icons";
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
// small heading. Put it in a SideNavLayout. It renders on the server too; only
// SideNavGroup, which remembers whether it's open, runs in the browser.
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
