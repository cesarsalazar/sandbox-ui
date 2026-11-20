// What a Sandbox app needs to install on a phone's home screen and run like
// an app (a PWA). Server-safe: use these in Next.js's app/manifest.ts and
// app/layout.tsx. See the README's "Installed app" section for the files an
// app adds (icons, the offline page, the service worker).

export type Platform = "ios" | "android";

// The page and brand colours, as theme.css has them. The manifest and the
// browser's own bars can't read CSS variables, so they're repeated here.
export const PWA_COLORS = {
  light: "#fffffa",
  dark: "#0b0b12",
  brand: "#211aff",
};

// iPhone or Android, from the browser's user agent (Next.js: headers().get(
// "user-agent")). Anything that isn't an iPhone or iPad gets Android's
// patterns, which is also what desktop browsers emulating a phone get.
export function platformFromUserAgent(userAgent: string | null | undefined): Platform {
  const ua = userAgent ?? "";
  const ipadAsMac = /Macintosh/.test(ua) && /Mobile/.test(ua);
  return /iPhone|iPad|iPod/.test(ua) || ipadAsMac ? "ios" : "android";
}

// The app's manifest (app/manifest.ts returns this). `startUrl` is where the
// home-screen icon opens. Icons go in public/icons: 192 and 512 pixel squares
// with the flower on Sandbox blue reaching the edges, and a "maskable" 512
// whose flower sits inside the middle 80%, since Android crops icons to its
// own shapes.
export function appManifest({
  name,
  shortName = name,
  description,
  startUrl = "/",
  id = startUrl,
  icons = "/icons",
}: {
  name: string;
  shortName?: string;
  description: string;
  startUrl?: string;
  id?: string;
  icons?: string;
}) {
  return {
    id,
    name,
    short_name: shortName,
    description,
    start_url: startUrl,
    scope: "/",
    display: "standalone" as const,
    orientation: "portrait" as const,
    // Android's launch screen: the icon on this colour while the app starts.
    background_color: PWA_COLORS.brand,
    theme_color: PWA_COLORS.light,
    icons: [
      { src: `${icons}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${icons}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${icons}/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" as const },
    ],
  };
}

// The viewport (app/layout.tsx: export const viewport = appViewport()).
// viewport-fit=cover lets the app reach under the status bar and home
// indicator; the pt-safe and pb-safe utilities keep content clear of them.
// The browser's bars take the page colour. `dark: false` for an app that
// shows only its light theme (<html data-theme="light">).
export function appViewport({ dark = true }: { dark?: boolean } = {}) {
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover" as const,
    themeColor: dark
      ? [
          { media: "(prefers-color-scheme: light)", color: PWA_COLORS.light },
          { media: "(prefers-color-scheme: dark)", color: PWA_COLORS.dark },
        ]
      : PWA_COLORS.light,
  };
}

// The parts of the page's metadata an installed app needs (app/layout.tsx:
// spread into `metadata`). On iPhone the app gets its own name under the icon
// and runs full screen with the status bar over the page.
export function appMetadata({ name, appleIcon = "/apple-touch-icon.png" }: { name: string; appleIcon?: string }) {
  return {
    applicationName: name,
    appleWebApp: { capable: true, title: name, statusBarStyle: "default" as const },
    formatDetection: { telephone: false },
    icons: { apple: appleIcon },
  };
}
