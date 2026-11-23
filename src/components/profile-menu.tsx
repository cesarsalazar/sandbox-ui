"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Avatar } from "./avatar";
import { CheckIcon } from "./icons";
import { cx } from "./cx";

// The person's photo at the end of the TopBar, opening a menu of what's
// theirs: who they're signed in as, any app-specific choices, and sign out.
// It closes on a click outside, on Escape, and once an item is chosen.
export function ProfileMenu({
  name,
  detail,
  src,
  children,
}: {
  name: string;
  /** A second line under the name, usually the email address. */
  detail?: ReactNode;
  src?: string | null;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const items = () => [...(root.current?.querySelectorAll<HTMLElement>("[role^=menuitem]") ?? [])];
    items()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const list = items();
        const at = list.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "ArrowDown" ? at + 1 : at - 1;
        list[(next + list.length) % list.length]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${name}: account menu`}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "flex cursor-pointer rounded-full transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          open ? "ring-3 ring-brand/20" : "hover:ring-3 hover:ring-line",
        )}
      >
        <Avatar name={name} src={src} size="sm" />
      </button>
      {/* Hidden rather than removed when closed: an item that submits a form
          must still be on the page when the submit happens, after the click. */}
      <div
        id={menuId}
        hidden={!open}
        role="menu"
        aria-label={name}
        // Choosing an item (a link, or a button in a form) closes the menu.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[role^=menuitem]")) setOpen(false);
        }}
        className="absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-card border border-line bg-surface py-1.5 shadow-card"
      >
        <div className="flex flex-col gap-0.5 border-b border-line px-4 pt-2 pb-3">
          <span className="truncate text-[15px] font-medium text-ink">{name}</span>
          {detail && <span className="truncate text-sm text-ink-muted">{detail}</span>}
        </div>
        <div className="flex flex-col pt-1.5">{children}</div>
      </div>
    </div>
  );
}

const item =
  "flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-[15px] text-ink transition-colors hover:bg-sunken focus:outline-none focus-visible:bg-sunken";

// One choice in a ProfileMenu: a link when given href, otherwise a button
// (type="submit" inside a form, for sign out and other posts). `selected`
// marks the current one of a set, such as which view you're in.
export function MenuItem({
  href,
  type = "button",
  onClick,
  selected,
  className,
  children,
}: {
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const mark =
    selected === undefined ? null : (
      <CheckIcon aria-hidden className={cx("ml-auto size-4 shrink-0 text-brand-ink", !selected && "invisible")} />
    );
  if (href) {
    return (
      <a role="menuitem" tabIndex={-1} href={href} onClick={onClick} className={cx(item, className)}>
        {children}
        {mark}
      </a>
    );
  }
  return (
    <button
      role={selected === undefined ? "menuitem" : "menuitemradio"}
      aria-checked={selected}
      tabIndex={-1}
      type={type}
      onClick={onClick}
      className={cx(item, className)}
    >
      {children}
      {mark}
    </button>
  );
}

// A hairline between groups of items.
export function MenuDivider({ className }: { className?: string }) {
  return <div role="separator" className={cx("my-1.5 border-t border-line", className)} />;
}
