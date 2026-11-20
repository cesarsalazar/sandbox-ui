"use client";

import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cx } from "./cx";

// A table of records on desktop: a card with a quiet header, rows between
// hairlines, 15px text. Admin screens use it (hubs, roles, broadcasts). Phones
// don't get tables: show those records as rows, or leave the screen to
// desktop.
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("overflow-x-auto rounded-card border border-line bg-surface shadow-card", className)}>
      <table className="w-full border-collapse text-left text-[15px]">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-line bg-sunken">{children}</tr>
    </thead>
  );
}

// A column heading. `align="end"` for numbers and the actions column.
export function Th({ align, className, ...props }: { align?: "start" | "end" } & Omit<ThHTMLAttributes<HTMLTableCellElement>, "align">) {
  return (
    <th
      className={cx("px-5 py-2.5 text-[13px] font-medium whitespace-nowrap text-ink-muted", align === "end" && "text-right", className)}
      {...props}
    />
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

// A row. When the whole row opens the record, give it onClick (and a link
// inside it for keyboards); it then shows as clickable. Its RowActions show on
// hover.
export function Tr({ className, onClick, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      onClick={onClick}
      className={cx("group/row transition-colors hover:bg-sunken/60", onClick && "cursor-pointer", className)}
      {...props}
    />
  );
}

export function Td({
  align,
  muted = false,
  nowrap = false,
  className,
  ...props
}: { align?: "start" | "end"; muted?: boolean; nowrap?: boolean } & Omit<TdHTMLAttributes<HTMLTableCellElement>, "align">) {
  return (
    <td
      className={cx(
        "px-5 py-3.5 align-middle",
        muted ? "text-ink-muted" : "text-ink",
        align === "end" && "text-right",
        nowrap && "whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

// A row's actions (edit, archive, delete), as IconButtons at the end of the
// row. They appear when the pointer is over the row, so a long list stays
// calm, and also whenever one of them has keyboard focus, and always on a
// touch screen, which has no hover. Clicks on them don't open the row.
export function RowActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cx(
        "flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

// The cell RowActions go in, narrow and at the end.
export function TdActions({ children }: { children: ReactNode }) {
  return <td className="w-px py-2 pr-3 pl-2 whitespace-nowrap">{children}</td>;
}
