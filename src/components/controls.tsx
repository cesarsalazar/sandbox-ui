"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, SearchIcon } from "./icons";
import { buttonClass, iconButtonClass, type ButtonVariant } from "./button";
import { cx } from "./cx";

// Two to four views of the same list: Active and Archived broadcasts, a
// postcard inbox and outbox. Not for settings (use Switch) or for navigation
// between pages (use links).
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  block = false,
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  /** What the choice is about, for screen readers: "Show". */
  label: string;
  /** Fill the row, each option an equal share. For phones. */
  block?: boolean;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx("inline-flex rounded-full border border-line-strong bg-surface p-1", block && "flex w-full", className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              "h-8 rounded-full px-4 text-sm whitespace-nowrap transition-colors",
              block && "flex-1",
              on ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// A search field: the magnifying glass inside, and optionally how many results
// there are at the end ("1–50 of 1,775"), on desktop; a phone is too narrow
// for both. Say in the placeholder what it searches.
export function SearchInput({
  count,
  className,
  ...props
}: { count?: ReactNode } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className={cx("relative", className)}>
      <SearchIcon size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint" />
      <input
        type="search"
        className={cx(
          "h-11 w-full rounded-field border border-line-strong bg-surface pl-11 text-[15px] text-ink placeholder:text-ink-faint transition-colors",
          "hover:border-ink-faint focus:border-brand focus:ring-3 focus:ring-brand/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden",
          count !== undefined ? "pr-3.5 md:pr-32" : "pr-3.5",
        )}
        {...props}
      />
      {count !== undefined && (
        <span className="tabular pointer-events-none absolute top-1/2 right-3.5 hidden -translate-y-1/2 text-sm text-ink-faint md:block">{count}</span>
      )}
    </div>
  );
}

// Moving through pages of a long list: previous, where you are, next.
export function Pagination({
  page,
  pages,
  onChange,
  className,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pages" className={cx("flex items-center justify-center gap-3", className)}>
      <button type="button" className={buttonClass({ variant: "secondary", size: "sm" })} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeftIcon size={16} /> Previous
      </button>
      <span className="tabular text-sm text-ink-muted">
        Page {page} of {pages}
      </span>
      <button type="button" className={buttonClass({ variant: "secondary", size: "sm" })} disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}

// Copies text, then says "Copied" for two seconds. If the browser refuses
// (the page isn't focused, say), nothing happens and nothing breaks.
export function CopyButton({
  text,
  label = "Copy",
  variant = "secondary",
  size = "sm",
  onCopy,
  className,
}: {
  text: string;
  label?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  onCopy?: () => void;
  className?: string;
}) {
  const [copied, copy] = useCopy(text, onCopy);
  return (
    <button type="button" onClick={copy} className={cx(buttonClass({ variant, size }), className)}>
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

// Copying, and saying so for two seconds. If the browser refuses (the page
// isn't focused, say), nothing happens and nothing breaks.
function useCopy(text: string, onCopy?: () => void): [boolean, () => Promise<void>] {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  }
  return [copied, copy];
}

// Copy as an icon, for where the value it copies is right beside it. In a
// list, put it in RowActions so it appears on hover, like the row's other
// actions, rather than repeating on every row.
export function CopyIconButton({
  text,
  label = "Copy",
  size = "sm",
  onCopy,
  className,
}: {
  text: string;
  /** What it copies, for screen readers and the tooltip: "Copy app ID". */
  label?: string;
  size?: "sm" | "md";
  onCopy?: () => void;
  className?: string;
}) {
  const [copied, copy] = useCopy(text, onCopy);
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      className={cx(iconButtonClass({ size }), className)}
    >
      {copied ? <CheckIcon size={16} className="text-success" /> : <CopyIcon size={16} />}
    </button>
  );
}

// A value with its copy icon after it, the icon appearing when the pointer
// is over the value, whenever it has keyboard focus, and always on a touch
// screen. For values shown among others, like an app's address and ID. A
// value shown once that must be copied now (a new key) gets a CopyButton,
// always visible, instead.
export function CopyText({
  text,
  label = "Copy",
  children,
  className,
}: {
  text: string;
  label?: string;
  /** How the value shows; the text itself in mono when left out. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx("group/copy inline-flex max-w-full min-w-0 items-center gap-1", className)}>
      {children ?? <code className="font-mono text-[13px] break-all text-ink">{text}</code>}
      <CopyIconButton
        text={text}
        label={label}
        className="-my-1.5 shrink-0 opacity-0 transition-opacity group-hover/copy:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
      />
    </span>
  );
}

// Where content is on its way: grey shapes the size of what's coming, so the
// page doesn't jump when it arrives. A slow shimmer runs across them unless
// reduced motion is on.
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cx("sbx-skeleton block rounded-field bg-sunken", className)} />;
}
