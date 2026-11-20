"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Flower, Logo } from "./logo";
import { IconButton } from "./button";
import { PlusSquareIcon, ShareIcon, WifiOffIcon, XIcon } from "./icons";
import { cx } from "./cx";
import type { Platform } from "../pwa";

// ---------------------------------------------------------------- state

// True when the app was opened from the home screen, not in a browser tab.
export function useStandalone() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(display-mode: standalone)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true,
    () => false,
  );
}

// False while the phone has no connection.
export function useOnline() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("online", onChange);
      window.addEventListener("offline", onChange);
      return () => {
        window.removeEventListener("online", onChange);
        window.removeEventListener("offline", onChange);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

// Android's own install prompt, when the browser offers one: call install()
// from a tap. iPhones have no such prompt; there, people add the app by hand.
export function useInstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  return {
    available: event !== null,
    install: async () => {
      if (!event) return false;
      await event.prompt();
      const { outcome } = await event.userChoice;
      setEvent(null);
      return outcome === "accepted";
    },
  };
}

// ---------------------------------------------------------------- welcome

// The first thing someone sees in the app before they've signed in: a whole
// screen of Sandbox blue with the flower, a headline in Instrument Serif (this
// is a landmark moment), one line on what the app is for, and the way in.
// Fills the phone, status bar included, in an installed app.
export function WelcomeScreen({
  title,
  description,
  action,
  secondary,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** The way in, usually the "Sign in with Sandbox" button or a WelcomeAction. */
  action: ReactNode;
  /** A quiet link under it: "What is Sandbox?". */
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cx("relative flex min-h-dvh flex-col overflow-hidden bg-brand text-on-brand pt-safe pb-safe px-safe", className)}
    >
      <Flower aria-hidden title="" className="pointer-events-none absolute -top-[12%] -right-[38%] w-[115%] text-white/[0.07] md:-right-[10%] md:w-[60%]" />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="pt-8">
          <Logo className="h-[22px] w-auto text-white" />
        </div>
        <div className="flex flex-1 flex-col justify-end gap-4 pb-10">
          <h1 className="font-serif text-[52px] leading-[1] text-balance">{title}</h1>
          {description && <p className="max-w-[34ch] text-[17px] leading-relaxed text-white/80">{description}</p>}
        </div>
        <div className="flex flex-col items-stretch gap-3 pb-6">
          {action}
          {secondary && <div className="text-center text-[15px] text-white/80">{secondary}</div>}
        </div>
      </div>
    </main>
  );
}

// The main button on the welcome screen: white on blue, full width.
export function WelcomeAction({ href, onClick, children }: { href?: string; onClick?: () => void; children: ReactNode }) {
  const cls = "inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-brand transition-opacity active:opacity-80";
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- install

const DISMISSED = "sbx-install-dismissed";

// Asks someone using the app in their phone's browser to add it to their home
// screen, where it opens full screen like any other app. Shows only on a phone,
// only in the browser (never once installed), and not again after they close
// it. On Android it offers the system's install prompt when the browser has
// one; on iPhone it shows the two steps in Safari, since iPhones have no
// install button.
export function InstallPrompt({ platform, appName, className }: { platform: Platform; appName: string; className?: string }) {
  const standalone = useStandalone();
  const { available, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISSED) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);
  if (standalone || dismissed) return null;
  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {}
  };

  return (
    <aside className={cx("rounded-card border border-line bg-surface p-4 shadow-card md:hidden", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-brand text-on-brand">
          <Flower aria-hidden title="" className="size-6" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
          <p className="text-[15px] font-semibold text-ink">Add {appName} to your home screen</p>
          <p className="text-sm text-ink-muted">It opens full screen, like your other apps.</p>
        </div>
        <IconButton label="Not now" size="sm" onClick={close} className="-mt-1 -mr-1">
          <XIcon size={18} />
        </IconButton>
      </div>
      {platform === "ios" ? (
        <ol className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4 text-[15px] text-ink">
          <li className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sunken text-brand-ink">
              <ShareIcon size={17} />
            </span>
            <span>
              Tap <span className="font-semibold">Share</span> in Safari’s toolbar
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sunken text-brand-ink">
              <PlusSquareIcon size={17} />
            </span>
            <span>
              Choose <span className="font-semibold">Add to Home Screen</span>
            </span>
          </li>
        </ol>
      ) : available ? (
        <button
          type="button"
          onClick={async () => (await install()) && close()}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-on-brand"
        >
          Install {appName}
        </button>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-[15px] text-ink">
          Open your browser’s menu <span className="font-semibold">⋮</span> and choose{" "}
          <span className="font-semibold">Install app</span> or <span className="font-semibold">Add to Home screen</span>.
        </p>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------- offline

// What an installed app shows when it's opened without a connection and the
// page isn't saved on the phone. The service worker serves the app's offline
// page, which renders this.
export function OfflineScreen({ appName, onRetry }: { appName: string; onRetry?: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-safe pt-safe pb-safe text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-sunken text-ink-muted">
        <WifiOffIcon size={28} />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">You’re offline</h1>
      <p className="max-w-[30ch] text-[17px] leading-relaxed text-ink-muted">{appName} needs a connection. Check your Wi-Fi or mobile data, then try again.</p>
      <button
        type="button"
        onClick={onRetry ?? (() => window.location.reload())}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-base font-semibold text-on-brand"
      >
        Try again
      </button>
    </main>
  );
}

// A thin bar under the status bar while the connection is gone, for screens
// that are already open. It goes away by itself when the connection is back.
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-ink pt-safe text-paper">
      <span className="flex h-8 items-center gap-2 text-sm font-medium">
        <WifiOffIcon size={15} /> No connection
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- service worker

// Registers the app's service worker (public/sw.js, copied from
// sandbox-ui/pwa/sw.js) so the offline page works. Put it once in the root
// layout. Off in development, where it would get in the way of reloading.
export function ServiceWorker({ src = "/sw.js" }: { src?: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(src).catch(() => {});
  }, [src]);
  return null;
}
