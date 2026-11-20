import type { ReactNode } from "react";
import { appViewport } from "../../src/pwa";
import { ToastProvider } from "../../src";
import "./globals.css";

export const metadata = { title: "sandbox-ui" };
export const viewport = appViewport();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
