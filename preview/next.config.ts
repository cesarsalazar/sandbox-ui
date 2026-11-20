import type { NextConfig } from "next";

// The preview of sandbox-ui's components. It imports them from ../src, inside
// the project root Next finds by sandbox-ui's package-lock.json. No dev badge,
// so the screens look as they will in an app.
const nextConfig: NextConfig = { devIndicators: false };

export default nextConfig;
