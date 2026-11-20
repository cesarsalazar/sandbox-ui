"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckIcon } from "./icons";
import { cx } from "./cx";

type Toast = { id: number; message: ReactNode; tone: "neutral" | "success" | "danger" };
const ToastContext = createContext<(message: ReactNode, tone?: Toast["tone"]) => void>(() => {});

// A short confirmation that something happened: "Link copied", "Saved",
// "Postcard sent". It appears near the bottom, above a phone's tab bar, and
// goes after three seconds. Screen readers hear it. Not for errors someone
// has to act on: those stay on the page next to what failed.
//
// Wrap the app in <ToastProvider>, then call useToast() anywhere.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);
  const show = useCallback((message: ReactNode, tone: Toast["tone"] = "neutral") => {
    const id = ++next.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+96px)] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cx(
              "sbx-pop flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium shadow-[0_8px_28px_-6px_rgb(10_10_20/0.35)]",
              t.tone === "danger" ? "bg-danger text-white" : "bg-ink text-paper",
            )}
          >
            {t.tone === "success" && <CheckIcon size={16} strokeWidth={2.25} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
