import type { ElementType, ReactNode } from "react";
import { Avatar } from "./avatar";
import { cx } from "./cx";

// A person in a directory on a tablet or desktop: a portrait card with the
// photo on top, the name on two lines (first, then last, so long names don't
// truncate), where they're based, and their role at the bottom. Every card in
// a grid has the same height, with or without a place or a role. Someone who has left
// shows in grey, with `status` saying so.
//
// It's a link to the person's page. Pass `as={Link}` for Next.js's own link.
// On a phone, show people as rows instead (PersonRow).
export function MemberCard({
  href,
  firstName,
  lastName,
  photo,
  photoFallback,
  place,
  role,
  status,
  former = false,
  as: Component = "a",
  className,
}: {
  href?: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  photoFallback?: string | null;
  place?: ReactNode;
  /** Shown as a badge at the bottom, like "Board member". Leave out for members. */
  role?: ReactNode;
  /** Replaces the role, for someone who has left: "Left in 2024". */
  status?: ReactNode;
  former?: boolean;
  as?: ElementType;
  className?: string;
}) {
  const label = status ?? role;
  return (
    <Component
      href={href}
      className={cx(
        "group flex h-full min-h-[288px] flex-col items-center rounded-card border border-line bg-surface px-4 pt-10 pb-6 text-center shadow-card transition-[border-color,box-shadow]",
        href && "hover:border-brand/30 hover:shadow-[0_2px_4px_rgb(10_10_20/0.04),0_12px_32px_rgb(10_10_20/0.08)] focus-visible:border-brand",
        className,
      )}
    >
      <Avatar
        name={`${firstName} ${lastName}`}
        src={photo}
        fallbackSrc={photoFallback}
        size="xl"
        former={former}
        className={cx("mb-4 transition-transform duration-200 motion-reduce:transition-none", href && !former && "group-hover:scale-[1.04]")}
      />
      <span className={cx("w-full truncate text-[15px] leading-snug font-semibold", former ? "text-ink-muted" : "text-ink")}>{firstName}</span>
      <span className={cx("w-full truncate text-[15px] leading-snug", former ? "text-ink-muted" : "text-ink")}>{lastName}</span>
      <span className="mt-1.5 min-h-5 w-full truncate text-sm text-ink-muted">{place}</span>
      <span className="mt-auto pt-3">
        {label ? (
          <span
            className={cx(
              "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium whitespace-nowrap",
              status ? "bg-sunken text-ink-muted" : "bg-brand-soft text-brand-ink",
            )}
          >
            {label}
          </span>
        ) : (
          <span aria-hidden className="block h-6" />
        )}
      </span>
    </Component>
  );
}

// The grid MemberCards sit in: as many columns as fit, never squeezed.
export function MemberGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-3", className)}>{children}</div>;
}

// A person in a list on a phone: photo, name, and a line under it (their role
// in blue, then where they're based). The whole row is the link.
export function PersonRow({
  href,
  name,
  photo,
  photoFallback,
  role,
  place,
  former = false,
  trailing,
  as: Component = "a",
  className,
}: {
  href?: string;
  name: string;
  photo?: string | null;
  photoFallback?: string | null;
  role?: ReactNode;
  place?: ReactNode;
  former?: boolean;
  /** Something at the end of the row, like a checkmark or a count. */
  trailing?: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component href={href} className={cx("flex min-h-[76px] items-center gap-4 py-2.5", className)}>
      <Avatar name={name} src={photo} fallbackSrc={photoFallback} size="lg" former={former} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cx("truncate text-[17px] font-semibold", former ? "text-ink-muted" : "text-ink")}>{name}</span>
        {(role || place) && (
          <span className="truncate text-[15px]">
            {role && <span className="font-medium text-brand-ink">{role}</span>}
            {role && place && <span className="text-ink-faint"> · </span>}
            {place && <span className="text-ink-muted">{place}</span>}
          </span>
        )}
      </span>
      {trailing}
    </Component>
  );
}

// PersonRows between hairlines.
export function PersonList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("divide-y divide-line", className)}>{children}</div>;
}
