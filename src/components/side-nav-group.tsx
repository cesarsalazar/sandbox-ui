"use client";

import type { ReactNode } from "react";
import { useId, useState, useSyncExternalStore } from "react";
import { ChevronDownIcon } from "./icons";
import { cx } from "./cx";

// In a file of its own because it keeps state in the browser: the rest of the
// side menu can then render on the server, with a link component passed in.

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

