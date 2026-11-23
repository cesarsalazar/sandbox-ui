"use client";

import { useEffect, type ElementType, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./icons";
import { cx } from "./cx";
import type { Platform } from "../pwa";

// ---------------------------------------------------------------- tab bar

// The tabs at the bottom of a phone screen: the three or four places people go
// most. It takes each platform's own form: on iPhone a capsule floating over
// the page (the page shows through), on Android a full-width bar with a pill
// behind the current tab's icon. Choose with `platform` (see
// platformFromUserAgent in pwa.ts). Phones only; desktop has the SideNav.
export function TabBar({ platform, children, className }: { platform: Platform; children: ReactNode; className?: string }) {
  return (
    <nav
      data-platform={platform}
      className={cx(
        "group/tabs fixed z-40 flex md:hidden",
        platform === "ios"
          ? "inset-x-5 bottom-[max(10px,calc(env(safe-area-inset-bottom,0px)-10px))] rounded-[34px] bg-surface/75 p-1 shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.6),0_8px_28px_-8px_rgb(17_17_42/0.28),0_1px_3px_rgb(17_17_42/0.08)] backdrop-blur-2xl backdrop-saturate-[1.8]"
          : "inset-x-0 bottom-0 border-t border-line bg-surface/95 pb-safe backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </nav>
  );
}

// One tab: an icon (22px; an avatar for the person's own tab) and a label.
export function TabBarItem({
  href,
  icon,
  active = false,
  onClick,
  as: LinkComponent = "a",
  children,
}: {
  href: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  as?: ElementType;
  children: ReactNode;
}) {
  return (
    <LinkComponent
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
        "group-data-[platform=ios]/tabs:h-[54px] group-data-[platform=ios]/tabs:rounded-[27px] group-data-[platform=ios]/tabs:text-[10px]",
        "group-data-[platform=android]/tabs:h-16 group-data-[platform=android]/tabs:text-xs",
        active ? "font-semibold text-brand-ink group-data-[platform=ios]/tabs:bg-brand-soft" : "text-ink-muted",
      )}
    >
      <span
        className={cx(
          "flex h-[26px] items-center justify-center",
          "group-data-[platform=android]/tabs:h-[30px] group-data-[platform=android]/tabs:w-14 group-data-[platform=android]/tabs:rounded-full",
          active && "group-data-[platform=android]/tabs:bg-brand-soft",
        )}
      >
        {icon}
      </span>
      {children}
    </LinkComponent>
  );
}

// ---------------------------------------------------------------- top bar

// The top of a phone screen that isn't a tab's first screen: one way out on
// the left (back or close), the title, and the screen's one action on the
// right. It stays at the top as the page scrolls, under the status bar.
// `below` holds what must stay in view under the bar, like a failed save.
export function PhoneBar({
  left,
  title,
  right,
  below,
  className,
}: {
  left?: ReactNode;
  title: ReactNode;
  right?: ReactNode;
  below?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("sticky top-0 z-30 border-b border-line bg-paper/90 pt-safe backdrop-blur-xl md:hidden", className)}>
      <div className="flex h-14 items-center gap-1 px-2">
        <div className="flex min-w-10 justify-start">{left}</div>
        <h1 className="min-w-0 flex-1 truncate text-center text-[17px] font-semibold text-ink">{title}</h1>
        <div className="flex min-w-10 justify-end">{right}</div>
      </div>
      {below}
    </header>
  );
}

const barControl = "inline-flex size-10 items-center justify-center rounded-full text-ink active:bg-sunken";

export function PhoneBarBack({
  href,
  label,
  onClick,
  as: LinkComponent = "a",
}: {
  href: string;
  /** Where it goes, for screen readers: "Members". */
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  as?: ElementType;
}) {
  return (
    <LinkComponent href={href} onClick={onClick} aria-label={`Back to ${label}`} className={barControl}>
      <ChevronLeftIcon size={26} strokeWidth={2} />
    </LinkComponent>
  );
}

export function PhoneBarClose({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Close" className={barControl}>
      <XIcon size={22} strokeWidth={2} />
    </button>
  );
}

// The bar's one action, as a small pill: Send, Save, Done.
export function PhoneBarAction({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-9 rounded-full bg-brand px-4 text-[15px] font-semibold text-on-brand disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// The first screen of a tab starts with its name in large type, instead of a
// bar: "Members", "Postcards". Clears the status bar in an installed app.
export function LargeTitle({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex items-center justify-between gap-3 pt-safe md:hidden", className)}>
      <h1 className="pt-4 text-[32px] leading-tight font-semibold tracking-tight text-ink">{children}</h1>
      {action && <div className="pt-4">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------- rows

// A phone's list of settings or choices: full-width rows between hairlines,
// straight on the page, with a small heading above each group.
export function RowGroup({ title, footer, children, className }: { title?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("flex flex-col", className)}>
      {title && <h2 className="pb-1 text-[13px] font-semibold tracking-wide text-ink-muted uppercase">{title}</h2>}
      <div className="divide-y divide-line">{children}</div>
      {footer && <p className="pt-2 text-sm text-ink-muted">{footer}</p>}
    </section>
  );
}

const rowBase = "flex min-h-14 w-full items-center gap-3 py-3 text-left text-[17px]";

// A row that opens another screen (with an arrow), or does something (a
// button, like Log out; `danger` for one that removes or ends something).
// `value` is what it's set to now, in grey before the arrow.
export function Row({
  href,
  onClick,
  icon,
  label,
  value,
  danger = false,
  as: LinkComponent = "a",
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  label: ReactNode;
  value?: ReactNode;
  danger?: boolean;
  as?: ElementType;
}) {
  const inner = (
    <>
      {icon && <span className={cx("flex w-7 shrink-0 justify-center", danger ? "text-danger" : "text-ink-muted")}>{icon}</span>}
      <span className={cx("shrink-0", danger ? "text-danger" : "text-ink")}>{label}</span>
      {value && <span className="ml-auto min-w-0 truncate text-[15px] text-ink-muted">{value}</span>}
      {href && <ChevronRightIcon size={18} className={cx("shrink-0 text-ink-faint", !value && "ml-auto")} />}
    </>
  );
  if (href) {
    return (
      <LinkComponent href={href} className={rowBase}>
        {inner}
      </LinkComponent>
    );
  }
  return (
    <button type="button" onClick={onClick} className={rowBase}>
      {inner}
    </button>
  );
}

// A row with a Switch at the end: a setting that's on or off. The whole row
// toggles it. Pass the Switch as `control`. Phone-sized on a phone, desktop-
// sized on desktop, so the same settings list serves both.
export function SwitchRow({ label, description, control }: { label: ReactNode; description?: ReactNode; control: ReactNode }) {
  return (
    <label className="flex min-h-14 cursor-pointer items-center gap-4 py-3 md:min-h-12 md:py-2.5">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[17px] text-ink md:text-[15px]">{label}</span>
        {description && <span className="text-sm text-ink-muted">{description}</span>}
      </span>
      {control}
    </label>
  );
}

// ---------------------------------------------------------------- photo viewer

// A photo shown whole, on black, over everything: a profile photo tapped to
// see it properly. Tap anywhere, Escape, or the close button to go back.
export function PhotoViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = overflow;
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={alt} onClick={onClose} className="sbx-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute top-[calc(env(safe-area-inset-top,0px)+12px)] right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
      >
        <XIcon size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
