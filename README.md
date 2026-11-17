# sandbox-ui

Sandbox's design system for its web apps: the brand's colours, fonts and logos
as a Tailwind 4 theme, and the React components built on them. Admissions is
the first app built with it. Members, finance and sandbox.is move to it later.

## The brand

From the brand kit (sandbox.is/brand):

- **Blue** `#211AFF`, on paper `#FFFFFA`
- **Instrument Serif** for landmark headlines
- **DM Sans** for text
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
  welcome page or a milestone, like being admitted. Not page titles, system
  messages, cards, names or numbers. Those are DM Sans, semibold. In
  `PageHeader` that's the `display` option, off by default.
- **Numbers that matter are JetBrains Mono** (`font-mono`): counts, points,
  dates in tables.
- **The colour wash** (yellow, blue and green fields on paper, as in members
  and auth) is the page background on desktop, and plain paper on phones.
  `bg-wash` puts it on any element.
- If an app needs something that isn't here, add it here rather than to the app.

## What's in it

| | |
|---|---|
| `Button`, `ButtonLink`, `buttonClass()` | primary, secondary, ghost, danger; three sizes |
| `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `ChoiceCards`, `Switch` | form controls with label, hint and error |
| `Card`, `Section`, `Divider` | grouping |
| `Badge`, `Notice` | status, in five tones |
| `Avatar` | a photo, or initials |
| `PageHeader`, `Container`, `TopBar`, `NavLink`, `DetailList` | page structure |
| `Progress`, `Steps` | progress towards a goal, and a numbered process |
| `EmptyState` | when there's nothing to show yet |
| `Logo`, `Flower` | the brand marks |

The fonts are under the SIL Open Font License; see `fonts/OFL-*.txt`.
