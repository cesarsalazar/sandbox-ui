import type { ElementType, ReactNode } from "react";
import { Logo } from "./logo";
import { cx } from "./cx";

// Navigation down the left side, for apps with more sections than fit across a
// TopBar (members has seven, one with pages of its own). Small apps use the
// TopBar instead. Desktop and tablet only: on a phone, use the TabBar.
//
// From the top: the logo, the signed-in person (their own page), the sections,
// and at the bottom whatever ends a session. Put it in a SideNavLayout.
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
      <div className="px-6 pt-8 pb-12">
        <LinkComponent href={home} className="inline-flex text-brand-ink">
          <Logo className="h-[22px] w-auto" />
        </LinkComponent>
      </div>
      {person && <div className="px-3 pb-2">{person}</div>}
      <nav className="flex flex-1 flex-col gap-1 px-3">{children}</nav>
      {footer && <div className="flex flex-col gap-1 px-3 pt-6 pb-5">{footer}</div>}
    </aside>
  );
}

// One section. `icon` is 18px (an avatar for the person's own row); every
// label starts on the same line. Sub-pages, as SideNavSubItems, show under
// the active section. Without `href` it's a button (Log out).
export function SideNavItem({
  href,
  icon,
  active = false,
  onClick,
  as: LinkComponent = "a",
  children,
  subItems,
}: {
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  as?: ElementType;
  children: ReactNode;
  subItems?: ReactNode;
}) {
  const Component = href ? LinkComponent : "button";
  return (
    <div>
      <Component
        href={href}
        onClick={onClick}
        type={href ? undefined : "button"}
        aria-current={active ? "page" : undefined}
        className={cx(
          "flex h-10 w-full items-center gap-3 rounded-full px-3 text-left text-[15px] transition-colors",
          active ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-muted hover:bg-sunken hover:text-ink",
        )}
      >
        {icon && <span className="flex w-6 shrink-0 justify-center">{icon}</span>}
        <span className="truncate">{children}</span>
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
