"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, IconButton } from "./button";
import { XIcon } from "./icons";
import { cx } from "./cx";

// While a dialog is open: the page behind it stays put, Escape closes it, and
// on a phone the back button or gesture closes it instead of leaving the page.
// The history entry waits a tick so React's double run in development doesn't
// add one and take it back.
function useDialogBehaviour(onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    let pushed = false;
    const onPop = () => {
      pushed = false;
      close.current();
    };
    const timer = setTimeout(() => {
      window.history.pushState(window.history.state, "");
      window.addEventListener("popstate", onPop);
      pushed = true;
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      if (pushed) window.history.back();
    };
  }, []);
}

// How much of the screen the on-screen keyboard covers, so a sheet can sit on
// top of it. Browsers on iPhones don't shrink the page for the keyboard.
function useKeyboardHeight() {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const view = window.visualViewport;
    if (!view) return;
    const update = () => setHeight(Math.max(0, window.innerHeight - view.height - view.offsetTop));
    view.addEventListener("resize", update);
    view.addEventListener("scroll", update);
    return () => {
      view.removeEventListener("resize", update);
      view.removeEventListener("scroll", update);
    };
  }, []);
  return height;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Focus moves into the dialog when it opens (to the field marked autoFocus, or
// the dialog itself), stays inside while it's open, and returns to whatever
// opened it when it closes.
function useFocusTrap(panel: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const el = panel.current;
    if (!el) return;
    // A field marked autoFocus, or the dialog itself: never the close button,
    // which would open the sheet with a focus ring on it.
    const first = el.querySelector<HTMLElement>("[autofocus], [data-autofocus]");
    (first ?? el).focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const a = items[0]!;
      const z = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [panel]);
}

const widths = { sm: "md:max-w-sm", md: "md:max-w-md", lg: "md:max-w-xl" };

function DialogPanel({
  title,
  description,
  onClose,
  size,
  footer,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  size: keyof typeof widths;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  useDialogBehaviour(onClose);
  const keyboard = useKeyboardHeight();
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(panel);
  const titleId = useId();
  const descId = useId();
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);

  // On a phone the top of the sheet drags down; far enough, and it closes.
  const grab = {
    onPointerDown(e: React.PointerEvent) {
      if (e.pointerType === "mouse" || (e.target as HTMLElement).closest("button")) return;
      start.current = e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove(e: React.PointerEvent) {
      if (start.current !== null) setDrag(Math.max(0, e.clientY - start.current));
    },
    onPointerUp(e: React.PointerEvent) {
      if (start.current === null) return;
      const moved = e.clientY - start.current;
      start.current = null;
      if (moved > 90) onClose();
      else setDrag(0);
    },
  };

  return (
    <div
      className="sbx-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[rgb(10_10_20/0.45)] md:items-center md:p-6"
      style={{ paddingBottom: keyboard || undefined }}
      onClick={onClose}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={drag ? { transform: `translateY(${drag}px)`, animation: "none" } : undefined}
        className={cx(
          "sbx-dialog flex max-h-[calc(100dvh-env(safe-area-inset-top,0px)-1.5rem)] w-full flex-col bg-surface outline-none",
          "rounded-t-[24px] shadow-[0_-12px_40px_rgb(10_10_20/0.18)]",
          "md:max-h-[calc(100dvh-3rem)] md:rounded-card md:border md:border-line md:shadow-[0_24px_64px_-12px_rgb(10_10_20/0.35)]",
          widths[size],
        )}
      >
        <div {...grab} className="shrink-0 touch-none md:touch-auto">
          <div aria-hidden className="mx-auto mt-2.5 h-[5px] w-9 rounded-full bg-ink/15 md:hidden" />
          <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-2 md:px-6 md:pt-6">
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id={titleId} className="text-xl font-semibold tracking-tight text-ink">
                {title}
              </h2>
              {description && (
                <p id={descId} className="text-[15px] leading-relaxed text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            <IconButton label="Close" variant="soft" onClick={onClose} className="-mr-1 md:-mt-1 md:-mr-2 md:bg-transparent md:hover:bg-sunken">
              <XIcon size={18} strokeWidth={2} />
            </IconButton>
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-4 md:px-6">{children}</div>
        {footer}
        {!footer && <div className="pb-safe" />}
      </div>
    </div>
  );
}

// A dialog: a centred box on desktop, and on a phone a sheet that rises from
// the bottom, scrolls inside itself, and drags down or goes back to close.
// Creating and editing the same thing use the same dialog, fields in the same
// order. Put buttons in `footer` with DialogActions.
export function Dialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  size?: keyof typeof widths;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  // Drawn only once the page is running in the browser: the server has no
  // document.body to put it on, and a dialog open from the start would
  // otherwise differ between the server's page and the browser's.
  const inBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!open || !inBrowser) return null;
  return createPortal(
    <DialogPanel title={title} description={description} onClose={onClose} size={size} footer={footer}>
      {children}
    </DialogPanel>,
    document.body,
  );
}

// A dialog's buttons. On desktop they sit in a row at the bottom right, with
// `start` (a destructive action like Delete) apart on the left. On a phone they
// stack full width, the main action (the last child) on top, in thumb reach.
export function DialogActions({ start, children }: { start?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col-reverse gap-2 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] md:flex-row md:items-center md:justify-end md:border-t md:border-line md:px-6 md:py-4 [&>button]:max-md:h-12 [&>button]:max-md:w-full [&>button]:max-md:text-base">
      {start && <div className="flex md:mr-auto [&>button]:max-md:h-12 [&>button]:max-md:w-full [&>button]:max-md:text-base">{start}</div>}
      {children}
    </div>
  );
}

// Asking before something that can't be taken back, or that reaches people:
// sending an email to 1,775 members, deleting a hub. Replaces the browser's
// own confirm box, which can't be styled and which phones show as a system
// alert. Say exactly what will happen in the title and the action.
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel?: ReactNode;
  danger?: boolean;
  busy?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <DialogActions>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={busy} data-autofocus>
            {confirmLabel}
          </Button>
        </DialogActions>
      }
    >
      {description && <p className="text-[15px] leading-relaxed text-ink-muted">{description}</p>}
    </Dialog>
  );
}
