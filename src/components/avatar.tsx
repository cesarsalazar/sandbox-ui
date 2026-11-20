"use client";

import { useState } from "react";
import { cx } from "./cx";

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-24 text-3xl",
  // A profile's own photo.
  "2xl": "size-36 text-5xl",
};

export type AvatarSize = keyof typeof sizes;

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

// A person's photo, or their initials on Sandbox blue when there isn't one.
//
// `src` is usually a small copy of the photo. If it can't be loaded,
// `fallbackSrc` (the original) is tried, and if neither loads the initials
// show, never a broken picture. The photo fades in over a tinted circle once
// it has arrived, so a list fills in face by face instead of popping; a photo
// the browser already has shows at once.
export function Avatar({
  name,
  src,
  fallbackSrc,
  size = "md",
  former = false,
  className,
}: {
  name: string;
  src?: string | null;
  fallbackSrc?: string | null;
  size?: AvatarSize;
  /** Someone who has left: their photo or initials are shown in grey. */
  former?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string | null>(null);
  const current = [src, fallbackSrc].find((u): u is string => Boolean(u) && !failed.includes(u!)) ?? null;
  const circle = cx(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    sizes[size],
    className,
  );

  if (current) {
    return (
      <span className={cx(circle, "bg-brand-soft")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={(img) => {
            // A cached photo can finish before React listens for it.
            if (img?.complete && img.naturalWidth > 0 && loaded !== current) setLoaded(current);
          }}
          src={current}
          alt={name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(current)}
          onError={() => setFailed((f) => [...f, current])}
          className={cx(
            "absolute inset-0 size-full rounded-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
            loaded === current ? "opacity-100" : "opacity-0",
            former && "grayscale",
          )}
        />
      </span>
    );
  }
  return (
    <span role="img" aria-label={name} className={cx(circle, "font-medium", former ? "bg-sunken text-ink-muted" : "bg-brand-soft text-brand-ink")}>
      {initialsOf(name)}
    </span>
  );
}
