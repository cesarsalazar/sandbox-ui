import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:border-ink-muted",
  ghost: "text-brand-ink hover:bg-brand-soft",
  danger: "border border-danger/40 bg-surface text-danger hover:bg-danger-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-[15px]",
  lg: "h-12 px-7 text-base",
};

// The classes for a button, for elements that aren't <Button>, such as a
// framework's link component.
export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}) {
  return cx(base, variants[variant], sizes[size], block && "w-full");
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; block?: boolean };

export function Button({ variant, size, block, className, type = "button", ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cx(buttonClass({ variant, size, block }), className)} {...props} />;
}

export function ButtonLink({ variant, size, block, className, ...props }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cx(buttonClass({ variant, size, block }), className)} {...props} />;
}

// A button that is only an icon: a row's pencil, a dialog's close, a profile's
// share. `label` is required, since there's no text for a screen reader.
// "quiet" is grey until hovered, for actions beside content; "outline" is the
// round secondary button of a profile's action row; "soft" sits on a sheet or
// a coloured surface; "danger" turns red on hover, for delete.
const iconVariants = {
  quiet: "text-ink-muted hover:bg-sunken hover:text-ink",
  outline: "border border-line-strong bg-surface text-ink hover:border-ink-muted",
  soft: "bg-sunken text-ink-muted hover:text-ink",
  danger: "text-ink-muted hover:bg-danger-soft hover:text-danger",
};
const iconSizes = { sm: "size-8", md: "size-10", lg: "size-12" };

export type IconButtonVariant = keyof typeof iconVariants;

export function iconButtonClass({ variant = "quiet", size = "md" }: { variant?: IconButtonVariant; size?: keyof typeof iconSizes } = {}) {
  return cx(
    "inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50",
    iconVariants[variant],
    iconSizes[size],
  );
}

export function IconButton({
  label,
  variant,
  size,
  className,
  type = "button",
  ...props
}: { label: string; variant?: IconButtonVariant; size?: keyof typeof iconSizes } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} aria-label={label} title={label} className={cx(iconButtonClass({ variant, size }), className)} {...props} />;
}
