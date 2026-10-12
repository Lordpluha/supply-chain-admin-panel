# DESIGN.md — visual and interaction contract

The reference `sc-designer` works from, and the context any agent should load before touching
a component. Project law for the mechanics lives in `.claude/rules/styling.md` and
`.claude/rules/a11y.md`; this file holds the intent behind it.

## Stance

An **operations panel**, not a marketing page. The operator is here to read a number and change
a row, repeatedly, for an hour. That sets every decision below:

- **Density over air.** Whitespace that makes a landing page feel calm makes a data panel feel
  slow. Compact rows, tight vertical rhythm, no hero sections.
- **Quiet chrome, loud data.** Borders and surfaces recede; the map's dots and the summary's
  figures are the only things competing for attention.
- **Never surprise.** No animation that moves something the operator is about to click, no
  layout that reflows when data arrives. Skeletons hold the shape.

## Themes

Three, selected by `data-theme` on `<html>`. **Light is the default** — the panel must be
correct before any script runs.

| Theme | When | Character |
|---|---|---|
| `light` | Default | White surfaces, near-black text, emerald accent. |
| `dark` | Preference | Near-black surfaces, high contrast. |
| `dim` | Long sessions | Slate-blue surfaces lifted off black; softer contrast, less glare. |

`dim` is a *dark* theme — the `dark:` variant matches it too, so components never learn about a
third mode.

Every colour is a semantic token (`--background`, `--card`, `--primary`, `--muted-foreground`,
`--destructive`, `--success`, `--warning`, `--border`, `--ring`, `--sidebar-*`, `--chart-1…5`,
`--chart-highlight`,
`--map-*`). A new token exists in **all three** blocks or it does not exist.

Accent is emerald: it reads as "supply / material" without being the green of a success state,
which is why `--success` is a separate, warmer token.

### Contrast

4.5:1 for body text, 3:1 for large text and UI boundaries, in all three themes. `dim` is the
one that fails first — check it, do not assume it.

## Typography

Scale and token names follow bitrate's `packages/ui-react/src/styles/typography.css`, as
semantic tokens: `display`, `h1`–`h6`, `body-lg`, `body`, `body-sm`, `label`, `caption`,
`overline`, `button`, `code`.

**Everything is `rem`.** No `px`, no `text-[…]`. Each token set is exposed as one `typo-*`
utility, and `<Typography>`'s variants map onto those — so the scale changes in exactly one
file.

Two faces: **Roboto** for body and data, **Raleway** for headings. Numbers in tables and on the
map use tabular figures so columns align.

> Note: bitrate's own `typography.tsx` carries a TODO about its hard-coded `text-[4.5rem]`
> values. This panel implements what that TODO points at — the semantic tokens that already
> existed beside it in `typography.css`.

## Layout

```
┌────────────┬──────────────────────────────────────────┐
│            │  header: page title · theme · lang · user│
│  sidebar   ├──────────────────────────────────────────┤
│  (nav,     │                                          │
│  filtered  │  page content                            │
│  by role)  │                                          │
└────────────┴──────────────────────────────────────────┘
```

- Sidebar: 16rem, collapsible to icons, becomes a sheet below `md`.
- Content: one column, max 96rem, 1.5rem gutters (1rem on mobile).
- **360 px is supported.** Tables scroll inside their own container rather than widening the
  page; the filter bar stacks; the overview switches layout outright (below).
- Dialogs cap at `85dvh` and scroll inside themselves. A centred, fixed popup taller than the
  viewport otherwise hangs off both ends with its buttons out of reach — and `dvh` rather than
  `vh` so a phone's collapsing URL bar cannot hide the footer.

Navigation is filtered by permission, so it never offers a page the operator will be refused.

## The world map

Hand-rolled SVG over `d3-geo` + `world-atlas` (110m). No map library, no tiles, no network at
runtime.

| Decision | Choice | Why |
|---|---|---|
| Projection | Natural Earth II | Balanced area distortion; does not exaggerate the north the way Mercator does, which matters when the data is Congo and Indonesia. |
| Land | `--map-land`, stroked `--map-land-stroke` | Recedes; it is context, not data. |
| Ocean | `--map-ocean` | Slightly tinted so the land edge reads without a heavy stroke. |
| Dot | Circle, `--primary`, radius from `√intensity` | Area — not radius — is proportional to output, because area is what the eye compares. |
| Hover | Radius grows, tooltip with country, total, unit, facility count | |
| Selected | Ring in `--ring`, summary pins to that country | |
| Empty | A sentence in the map's own surface, not a blank rectangle | |

**Dot size carries magnitude; colour never carries meaning alone.** Every dot is a real
focusable control with a name like "Germany, 22 000 t, 3 facilities", and the same data exists
in text in the summary's "by country" list. The map is an *additional* way to read the data,
never the only one.

### Zoom, focus and the readout

Selecting a country fits it to **75% of the widget** from its own projected bounding box, so
Germany and Australia both fill the frame rather than sharing one zoom that suits neither. The
sphere, the graticule and the land all sit inside the transformed group — left outside it, the
globe's outline stays at world scale and hangs around a country that has been zoomed into.

Marks divide their size, stroke width and focus rings by the view scale. A CSS `outline` on an
element inside a transformed group is scaled with it, so at a 16× country zoom a 2px ring
renders 32px wide; the rings are drawn as SVG circles instead, with the radius divided back
down. Facilities get a **dashed** ring in `--chart-2`, distinct from both the focus ring and a
country's solid selection ring.

The readout card **stays on screen while something is selected**, not only while it is hovered,
and carries a `--primary` border and ring to say it belongs to the selection. Hovering takes
precedence over it. On wide screens it sits in whichever top corner is opposite its subject; on
narrow ones it spans the foot of the map.

### Which list narrows

The overview's two modes are labelled by direction — **Country → product** and
**Product → country** — because the arrow is the whole point: it says which of
the two lists stays complete and which narrows to match. "A country first" named
an order and left the consequence to be guessed.

The arrow is decorative to a screen reader, so each tab's accessible name spells
the order out in words, and the info button beside the label explains the *active*
mode rather than describing both in the abstract.

### The overview on a phone

Below `md` the overview is a different layout, not the same one reflowed — CSS can hide things,
but it cannot turn a toolbar into a drawer.

| Desktop | Phone |
|---|---|
| Filter bar above the map | Floating **Filters** button, opening a bottom sheet |
| Map as a panel, 2:1 | Map with an **expand** control that fills the viewport |
| Readout in the opposite top corner | Readout across the foot, within thumb reach |
| Summary cards in a masonry | Same cards, single column |

The sheet is a Base UI `Drawer`: a swipe handle, drag-to-dismiss, backdrop opacity tied to the
swipe progress. Its footer holds **Reset**, **Close** and an apply button that counts what is
left (`Show 3 countries`). The filters still apply as they are changed rather than on apply —
they live in the URL, and a sheet that batched them would have to hold a second, divergent copy
of the same state. The button is an acknowledgement and a count, which is what makes it worth
pressing.

## Record pages

Every country, product, facility, production record and user has its own page, reached from an
arrow on its row or from any link that names it elsewhere.

- A back link **above** the title, not beside it — a crumb below the heading reads as decoration.
- Fields as a `<dl>`, so a label and its value are announced as a term and its definition.
- Related records as a plain list, not a table: a handful of rows whose job is to be clicked
  through do not need sort, search and pagination chrome around them.
- Cards in a masonry, so a short block does not stretch to match a tall neighbour.
- A finished request with no record says **"not found"**. An id in the address bar that resolves
  to nothing is a deleted row or a mistyped link, and both deserve saying.

## Data tables

Sorting a column cycles **ascending → descending → off**. The third press clears
both keys from the URL, so the list returns to the order the API gave it — which
is often the order a reader wants, and which a two-state toggle can never get
back to. The header's accessible name always says what the *next* press does,
because the icon and `aria-sort` already carry the current state.


Every filter control in a table toolbar carries a caption above it. A row of bare selects
reading "All", "All", "All" names the current value and never the question, which is exactly
backwards for a control nobody has touched yet. The search box gets a real `<label for>`; a
select whose trigger is a `<button>` cannot have one, so its caption is `aria-hidden` and the
control keeps the same string as its `aria-label` — read from the same translation key, so the
two cannot drift.


One `DataTable` serves all seven entities. It lives in `shared/ui` rather than `widgets`, because it knows nothing about the domain — a table is a primitive, and putting it in `widgets` made two widgets import each other, which `pnpm lint` refuses. Every table has, without exception:

- **Search** — debounced, in the URL.
- **Sort** — click a header; direction in the URL.
- **Filter** — entity-specific selects; in the URL.
- **Pagination** — page and size in the URL.
- **Export** — exactly the filtered, sorted set, to `.xlsx`.

State lives in the URL so a filtered view is a link somebody can paste into a message.

Row actions sit at the right in a menu, never as a row of naked icons. Destructive actions
confirm in a dialog that names what is being deleted.

## Forms

Dialogs, not pages. Create and edit share one form; the difference is the default values and
the mutation.

Labels sit above inputs (scan speed beats horizontal compactness here). Errors appear under the
field, tied with `aria-describedby`, and the field is marked `aria-invalid`. Server-side field
errors land on the same fields — never in a toast.

## Error screens

One block — an icon in a muted disc, a heading, a sentence, an optional quotable
detail, and the way out — reused by all four:

| Code | Screen | Icon | Says |
|---|---|---|---|
| 404 | Not found | magnifier with a cross | The path that missed |
| 403 | No access | shield | The permission that is missing |
| 500 | Crashed | warning triangle | The server's sentence, or the thrown message in development |
| — | Could not start | unplugged | That the mock worker needs a secure context |

The code is **text beside the icon**, not the usual enormous numeral: "404" at
8rem is decoration, and what a reader needs is the sentence. It sits last and
quiet, because it is for a bug report rather than for the reader.

The block sets no height of its own. Inside the panel it fills the content area
and the shell stays — sidebar, header, somewhere else to go. Standing alone it
is wrapped in a `<main>` that fills the viewport. The same screen in both
places, not two.

Every one of them offers at least one action. A dead end is not an error page.

## Feedback

| Situation | Treatment |
|---|---|
| Loading a list | Skeleton rows at the final height — no layout shift. |
| Loading the map | The land renders immediately; dots fade in. |
| Mutation in flight | Submit disabled, label changes to "Saving…". |
| Success | Toast, bottom-right, 4s. |
| Refused (403) | Inline message naming the missing permission, not a toast that vanishes. |
| Empty after filtering | A sentence plus a "clear filters" action. |

## Motion

Cheap and short: 150 ms for hover and focus, 200 ms for dialogs, nothing over 250 ms. Only
`transform` and `opacity`.

`prefers-reduced-motion: reduce` is honoured globally. Do not reintroduce an unconditional
animation.

## Browser support

Chrome/Edge 111+, Firefox 113+, Safari 16.4+ — stated in `browserslist`.

**CSS sets that floor, not JavaScript.** `oklch()` and `@custom-variant` are what a browser has
to support to render the panel at all; no polyfill changes that. `@vitejs/plugin-legacy` was
tried and removed for exactly this reason — against this browserslist it emitted no polyfill
chunk whatsoever, so it was build time spent on nothing. The two ES2023 array methods that
would otherwise have needed it (`toSorted`, `toReversed`) are two functions in
`shared/lib/array.ts` instead.

Anything newer than the floor needs a fallback and a note here.
