import { cx } from "./cx";

const sizes = { xs: "size-6 text-[10px]", sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-lg", xl: "size-24 text-3xl" };

// A person's photo, or their initials on Sandbox blue when there isn't one.
export function Avatar({ name, src, size = "md", className }: { name: string; src?: string | null; size?: keyof typeof sizes; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const cls = cx("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", sizes[size], className);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={cx(cls, "bg-sunken object-cover")} />;
  }
  return (
    <span role="img" aria-label={name} className={cx(cls, "bg-brand-soft font-medium text-brand")}>
      {initials}
    </span>
  );
}
