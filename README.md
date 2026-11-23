# sandbox-ui

Sandbox's design system for its web apps: the brand's colours, fonts and logos
as a Tailwind 4 theme, and the React components built on them. Admissions is
the first app built with it. Members, finance and sandbox.is move to it later.

## The brand

From the brand kit (sandbox.is/brand):

- **Blue** `#211AFF`, on paper `#FFFFFA`
- **Instrument Serif** for landmark headlines
- **Instrument Sans** for text (the brand kit has DM Sans; Instrument Sans
  was chosen instead, and members already uses it)
- **JetBrains Mono** for numbers and code
- The logo and the flower, which take the text colour

Every colour has a dark-mode value. Pages follow the system setting unless
`<html data-theme="light">` or `"dark"` says otherwise.

## Use it in a Next.js app

Install it from GitHub, pinned to a tag:

```json
"sandbox-ui": "github:cesarsalazar/sandbox-ui#v0.1.0"
```

Let Next.js compile it (`next.config.ts`):

```ts
const nextConfig = { transpilePackages: ["sandbox-ui"] };
```

Import the theme after Tailwind, and point Tailwind at the components so it
generates their classes (`app/globals.css`):

```css
@import "tailwindcss";
@import "sandbox-ui/theme.css";
@source "../../node_modules/sandbox-ui/src";
```

Then use the components:

```tsx
import { Button, Card, PageHeader } from "sandbox-ui";
```

## Rules

- **Colours only through the tokens** (`bg-paper`, `text-ink`, `text-ink-muted`,
  `border-line`, `bg-brand`, `bg-success-soft`…), never a hex value in an app.
  That's what makes dark mode work with no extra classes.
- **Two blues.** `brand` is for fills: buttons, progress, step dots. It always
  carries white text (`text-on-brand`). `brand-ink` is for blue text, links and
  marks. In dark mode they part: the fill stays a saturated blue that white text
  reads on, and the text blue lightens so it reads on the dark page.
- **Instrument Serif is for landmark moments only:** the one headline of a
  welcome page or a milestone, like being admitted, and a person's name as
  the headline of their own profile, under their photo. Not page titles,
  system messages, cards, names in lists, or numbers. Those are Instrument
  Sans, semibold. In `PageHeader` that's the `display` option, off by default.
- **Numbers that matter are JetBrains Mono** (`font-mono`): points, codes,
  figures in a table column. A count inside a sentence ("1,775 members") stays
  in Instrument Sans, with `tabular`.
- **The colour wash** (yellow, blue and green fields on paper, as in members
  and auth) is the page background on desktop, and plain paper on phones.
  `bg-wash` puts it on any element.
- **Sign-in screens use `SignInFrame`**, with one main action per screen. Where
  there are two ways in, ask first with `ChoiceLinks`, then show each way on
  its own screen. "Sign in with Sandbox" takes the large button's size here;
  add `data-block` to its placeholder to fill the row.
- **Navigation:** a small app uses the `TopBar`; an app with many sections, or
  sections with pages of their own, uses the `SideNav`. On a phone, either way,
  the `TabBar` holds the three or four places people go most.
- **Create, view and edit share one structure.** Adding a thing and changing it
  open the same `Dialog`, fields in the same order.
- **Row actions appear on hover** (`RowActions`): a pencil, archive, delete at
  the end of a row, not a visible button on every row. They also appear for
  the keyboard, and always on touch screens.
- **Copy appears on hover too.** In a list where every row has something to
  copy, the copy icon (`CopyIconButton`) goes in the row's `RowActions` (a
  row outside a `Table` needs the `group/row` class); for
  values shown among others, like an app's address and ID, `CopyText` shows
  the icon when the pointer is on the value. Never a Copy button repeated on
  every row. One value shown once, like a new key, keeps a visible
  `CopyButton`.
- **Details stack, one per line** (`DetailList`), never in columns.
- **Ask with `ConfirmDialog`**, never the browser's `confirm()`, before
  anything that can't be undone or that reaches people.
- **Phones get what a phone is for.** Admin screens (tables, bulk actions)
  stay on desktop; don't build phone versions of them.
- If an app needs something that isn't here, add it here rather than to the app.

## What's in it

| | |
|---|---|
| `Button`, `ButtonLink`, `buttonClass()` | primary, secondary, ghost, danger; three sizes |
| `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `ChoiceCards`, `ChoiceList`, `Switch` | form controls with label, hint and error; `ChoiceList` is one box with a row per option, for a short list of answers like Approve / Reject / Abstain, and `ChoiceCards` a card per option, for choices that each need a sentence |
| `fieldClasses` | the same look for a control an app draws itself: `input`, `select`, `textarea`, `label`, `hint`, `error` |
| `InputGroup`, `GroupInput`, `GroupSelect` | one control in parts, such as country code and phone number |
| `Card`, `Section`, `Divider` | grouping |
| `Badge`, `Notice` | status, in five tones |
| `Avatar` | a photo, or initials; tries a fallback photo, fades in, greys out someone who has left |
| `PageHeader`, `Container`, `TopBar`, `NavLink`, `DetailList` | page structure; details stack one per line |
| `ProfileMenu`, `MenuItem`, `MenuDivider` | the person's photo at the end of the `TopBar`, opening a menu with their name and email, any app choices (a `selected` item shows a check), and sign out. Pass sign out as a `MenuItem type="submit"` inside a POST form |
| `IconButton` | a button that's only an icon (quiet, outline, soft, danger), always with a label |
| `MemberCard`, `MemberGrid` | people in a directory on desktop: vertical cards, photo on top, equal heights |
| `PersonRow`, `PersonList` | people in a list on a phone |
| `Table`, `THead`, `Th`, `TBody`, `Tr`, `Td`, `TdActions`, `RowActions` | records on desktop, with actions that appear on hover |
| `Dialog`, `DialogActions`, `ConfirmDialog` | sizes sm to xl; a box on desktop, a sheet from the bottom on a phone (swipe or back to close, stays above the keyboard); asking before something that can't be undone |
| `SegmentedControl` | two to four views of one list: Active and Archived |
| `SearchInput`, `Pagination` | finding and paging through long lists |
| `CopyButton`, `CopyIconButton`, `CopyText`, `Skeleton` | copying a value: a button, an icon for row actions, a value whose icon appears on hover; grey shapes while content loads |
| `ToastProvider`, `useToast` | short confirmations: "Link copied", "Saved" |
| `SideNav`, `SideNavItem`, `SideNavSubItem`, `SideNavLayout` | navigation down the left side, for apps with many sections |
| `TabBar`, `TabBarItem` | the tabs at the bottom of a phone: a floating capsule on iPhone, a full-width bar on Android |
| `PhoneBar`, `PhoneBarBack`, `PhoneBarClose`, `PhoneBarAction`, `LargeTitle` | the top of a phone screen |
| `RowGroup`, `Row`, `SwitchRow` | a phone's settings and choices |
| `PhotoViewer` | a photo shown whole, on black |
| `WelcomeScreen`, `WelcomeAction` | the first screen of the installed app, before signing in |
| `InstallPrompt` | asks phone users in the browser to add the app to their home screen |
| `OfflineScreen`, `OfflineBanner`, `ServiceWorker` | working without a connection |
| `useStandalone`, `useOnline`, `useInstallPrompt` | is the app installed, is there a connection, can Android install it |

Components that are links take `as`, so an app can pass Next.js's `Link`
(`<MemberCard as={Link} href=… />`).

## Installed app (PWA)

Sandbox apps install on a phone's home screen and open full screen, like any
other app. For an app to do that well:

1. **Manifest and viewport.** In `app/manifest.ts`, return
   `appManifest({ name, description, startUrl })` from `sandbox-ui/pwa`. In
   `app/layout.tsx`, `export const viewport = appViewport()` (or
   `appViewport({ dark: false })` for an app shown only in light), and spread
   `appMetadata({ name })` into `metadata`.
2. **Icons** in `public/icons`: `icon-192.png` and `icon-512.png` (the flower
   on Sandbox blue, to the edges) and `maskable-512.png` (the flower inside
   the middle 80%, since Android crops icons into its own shapes), and
   `public/apple-touch-icon.png` at 180 pixels for iPhone.
3. **Offline.** Copy `sandbox-ui/pwa/sw.js` to `public/sw.js`, add an
   `/offline` page that renders `<OfflineScreen appName=… />`, and put
   `<ServiceWorker />` in the root layout. The worker caches only that page.
4. **Platform.** Pick the tab bar's form from the request:
   `platformFromUserAgent(headers().get("user-agent"))`.
5. **Screens.** Before signing in, the app opens on a `WelcomeScreen`. Signed
   in, in a phone's browser, show `InstallPrompt` once near the top of the
   first screen. Give every screen `pt-safe`/`pb-safe` room (`LargeTitle`,
   `PhoneBar` and `TabBar` already do).

## Preview

`npm install`, then `npm run preview` and open http://localhost:3070: every
component working, phone screens at iPhone size, and desktop examples.
| `SignInFrame`, `ChoiceLinks` | sign-in screens, laid out as auth.sandbox.is's login: the logo over one centred card, no top bar or footer; and a list of choices for a screen that asks a question first |
| `Progress`, `Steps` | progress towards a goal, and a numbered process |
| `EmptyState` | when there's nothing to show yet |
| `Logo`, `Flower` | the brand marks |

The fonts are under the SIL Open Font License; see `fonts/OFL-*.txt`.
