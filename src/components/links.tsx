"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBehance,
  FaBluesky,
  FaDribbble,
  FaFacebook,
  FaFigma,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaPinterest,
  FaReddit,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaVimeoV,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { cx } from "./cx";
import { fieldClasses } from "./field";
import { GlobeIcon, PlusIcon, XIcon } from "./icons";
import { MAX_LINKS, displayLink, normalizeLink, siteOf, type Site } from "../links";

// Brand icons are Font Awesome's (CC BY 4.0), through react-icons.
const ICONS: Record<Site, IconType> = {
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  x: FaXTwitter,
  github: FaGithub,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  threads: FaThreads,
  bluesky: FaBluesky,
  medium: FaMedium,
  behance: FaBehance,
  dribbble: FaDribbble,
  vimeo: FaVimeoV,
  pinterest: FaPinterest,
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  figma: FaFigma,
  reddit: FaReddit,
};

// The site's own icon when it's one people know, a globe for anything else.
export function LinkIcon({ url, size = 16 }: { url: string; size?: number }) {
  const site = siteOf(url);
  const Icon = site ? ICONS[site] : null;
  return Icon ? <Icon size={size} aria-hidden className="shrink-0" /> : <GlobeIcon size={size} className="shrink-0" />;
}

// Someone's links, one under the other, each with its site's icon.
export function LinkList({ links, className }: { links: string[]; className?: string }) {
  return (
    <ul className={cx("flex flex-col gap-2", className)}>
      {links.map((url) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-2 text-sm text-ink transition-colors hover:text-brand-ink"
          >
            <span className="text-ink-muted">
              <LinkIcon url={url} />
            </span>
            <span className="truncate">{displayLink(url)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Editing links: a box per link, showing its site's icon as it's typed, a way
// to remove it, and another box until there are five. There's always at least
// one box, so there's somewhere to start.
//
// Controlled with value and onChange, or left to itself with defaultValue.
// Given a name, each box is a form field of that name, so a form's data has
// the links as typed; clean them with normalizeLink on the server.
export function LinksEditor({
  name,
  value,
  defaultValue,
  onChange,
  max = MAX_LINKS,
  disabled = false,
  invalid = false,
  className,
}: {
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (links: string[]) => void;
  max?: number;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  const [own, setOwn] = useState<string[]>(defaultValue ?? []);
  const current = value ?? own;
  const rows = current.length ? current : [""];
  const set = (next: string[]) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {rows.map((link, i) => {
        // The icon follows what's typed, once it reads as an address.
        const url = normalizeLink(link);
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted">
                {url ? <LinkIcon url={url} /> : <GlobeIcon size={16} />}
              </span>
              <input
                type="text"
                name={name}
                inputMode="url"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label={`Link ${i + 1}`}
                aria-invalid={invalid || undefined}
                value={link}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = e.target.value;
                  set(next);
                }}
                placeholder={i === 0 ? "e.g. linkedin.com/in/yourname" : "Another link"}
                className={cx(fieldClasses.input, "pl-10")}
              />
            </div>
            {(rows.length > 1 || link) && (
              <button
                type="button"
                onClick={() => set(rows.filter((_, j) => j !== i))}
                disabled={disabled}
                aria-label={`Remove link ${i + 1}`}
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-sunken hover:text-ink disabled:opacity-50"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
        );
      })}
      {rows.length < max && rows[rows.length - 1] && (
        <button
          type="button"
          onClick={() => set([...rows, ""])}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand-ink hover:underline disabled:opacity-50"
        >
          <PlusIcon size={16} /> Add another link
        </button>
      )}
    </div>
  );
}
