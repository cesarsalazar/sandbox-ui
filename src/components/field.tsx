import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cx } from "./cx";

const control =
  "w-full rounded-field border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint " +
  "transition-colors hover:border-ink-faint focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15 " +
  "disabled:bg-sunken disabled:text-ink-faint aria-invalid:border-danger aria-invalid:focus:ring-danger/15";

// A label, the control, and a hint or error under it. Pass the control as the
// child; Field gives it an id and links the hint and error to it.
export function Field({
  label,
  hint,
  error,
  optional,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">Optional</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, rows = 5, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cx(control, "min-h-24 py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(control, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-muted">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Checkbox({ label, className, ...props }: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx("flex cursor-pointer items-start gap-3 text-[15px] text-ink", className)}>
      <input type="checkbox" className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-brand" {...props} />
      <span>{label}</span>
    </label>
  );
}

// A choice shown as a set of cards, for decisions that need a sentence of
// explanation per option.
export function ChoiceCards({
  name,
  options,
  value,
  defaultValue,
  onChange,
  legend,
}: {
  name: string;
  legend?: ReactNode;
  options: { value: string; label: ReactNode; description?: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      {legend && <legend className="mb-1.5 text-sm font-medium text-ink">{legend}</legend>}
      {options.map((o) => (
        <label
          key={o.value}
          className="flex cursor-pointer items-start gap-3 rounded-field border border-line-strong bg-surface p-4 transition-colors hover:border-ink-faint has-checked:border-brand has-checked:bg-brand-soft"
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === undefined ? undefined : value === o.value}
            defaultChecked={defaultValue === o.value}
            onChange={onChange ? () => onChange(o.value) : undefined}
            className="mt-1 size-4 shrink-0 cursor-pointer accent-brand"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-medium text-ink">{o.label}</span>
            {o.description && <span className="text-sm text-ink-muted">{o.description}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

// An on/off switch, for a setting that takes effect as a choice in a list
// (sharing a field, allowing email). Pass a label for screen readers when the
// visible label sits elsewhere.
export function Switch({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={cx(
        "relative h-6 w-10 shrink-0 cursor-pointer appearance-none rounded-full bg-line-strong transition-colors checked:bg-brand",
        "after:absolute after:top-[3px] after:left-[3px] after:size-[18px] after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-['']",
        "checked:after:translate-x-4 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
