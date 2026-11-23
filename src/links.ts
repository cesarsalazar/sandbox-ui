// A person's links: up to five addresses they choose to show, such as on a
// member's page or an application. Typed with or without http(s)://, stored
// as https, shown without it. Apps check links with normalizeLink on the
// server too.

export const MAX_LINKS = 5;

// "LinkedIn.com/in/galyna/" or "http://linkedin.com/in/galyna" →
// "https://linkedin.com/in/galyna". Null for something that can't be an
// address: no dot in the name, spaces, a username and password, or a
// protocol other than http(s).
export function normalizeLink(input: string): string | null {
  const raw = input.trim().replace(/^https?:\/\//i, "");
  if (!raw || /\s/.test(raw) || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  let url: URL;
  try {
    url = new URL(`https://${raw}`);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(url.hostname)) return null;
  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return `https://${url.host.toLowerCase()}${path}${url.search}${url.hash}`;
}

// What a member's page shows: the address without its protocol.
export function displayLink(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

// Which known site a link is on, for its icon; null for anything else.
const SITES: { site: string; domains: string[] }[] = [
  { site: "linkedin", domains: ["linkedin.com", "lnkd.in"] },
  { site: "instagram", domains: ["instagram.com"] },
  { site: "x", domains: ["x.com", "twitter.com"] },
  { site: "github", domains: ["github.com"] },
  { site: "facebook", domains: ["facebook.com", "fb.com"] },
  { site: "youtube", domains: ["youtube.com", "youtu.be"] },
  { site: "tiktok", domains: ["tiktok.com"] },
  { site: "threads", domains: ["threads.net", "threads.com"] },
  { site: "bluesky", domains: ["bsky.app"] },
  { site: "medium", domains: ["medium.com"] },
  { site: "behance", domains: ["behance.net"] },
  { site: "dribbble", domains: ["dribbble.com"] },
  { site: "vimeo", domains: ["vimeo.com"] },
  { site: "pinterest", domains: ["pinterest.com"] },
  { site: "telegram", domains: ["t.me", "telegram.me"] },
  { site: "whatsapp", domains: ["wa.me", "whatsapp.com"] },
  { site: "spotify", domains: ["spotify.com"] },
  { site: "soundcloud", domains: ["soundcloud.com"] },
  { site: "figma", domains: ["figma.com"] },
  { site: "reddit", domains: ["reddit.com"] },
];

export type Site = (typeof SITES)[number]["site"];

export function siteOf(url: string): Site | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  const found = SITES.find((s) => s.domains.some((d) => host === d || host.endsWith(`.${d}`)));
  return found?.site ?? null;
}
