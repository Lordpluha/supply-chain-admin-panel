# Supply Chain admin panel

An operations panel that answers one question well:

> **Where is this product made, how much of it, and how has that changed?**

Production is plotted on a world map for any year range between 2010 and 2026,
and you can arrive at the answer from either direction — pick a country and see
what it makes, or pick a product and see who makes it.

<!-- Take-home prototype. Proprietary; see LICENSE. -->

---

## Quick start

```bash
nvm use          # Node 24.21.0, pinned in .nvmrc
corepack enable
pnpm install
pnpm dev         # http://localhost:3000
```

The login form arrives pre-filled with the seeded operator
(`admin@example.com`). The point of the prototype is the map, not a login
ceremony.

Three other accounts exist so the permission model is visible rather than
claimed — see [`DEPLOYMENT.md`](DEPLOYMENT.md#local-development).

---

## Requirements

The brief this was built against, and where each part of it lives.

> Create a prototype to visualise the production of a product of a country on a
> world map for a given time period, for the years 2010–2026. The user should be
> able to choose either country or product first and afterwards a filtered
> choice for the other — if a user chooses a country, only products in that
> country can be chosen, and vice versa. Names of products and production values
> may be mocked.

| Requirement | Where |
|---|---|
| World map of production, by country | `widgets/world-map` — hand-rolled SVG over d3-geo |
| Year range 2010–2026 | `YEAR_MIN`/`YEAR_MAX`, a two-thumb range filter |
| Country **or** product first | The mode tabs in `features/supply-filters` |
| The second list filtered by the first | Joined server-side through facilities and production records — not a hard-coded table |
| Mocked names and values | `app/mocks/seed`, deterministic across reloads |

Added on top of the brief, and each one is load-bearing somewhere in the code:

| | |
|---|---|
| **Architecture** | Feature-Sliced Design, enforced by `pnpm lint` rather than described |
| **State** | React Query for the server, Zustand for the client, nuqs for the URL |
| **CRUD** | Every entity, with search, sort, filter, pagination and its own record page |
| **Access** | Roles and permissions, checked twice — in the UI and in the API |
| **Audit** | A read-only activity log; IP addresses behind their own permission |
| **Export** | The filtered set as `.xlsx`, `.xls` or `.csv` |
| **i18n** | English, German, French, Polish — fully typed, derived from English |
| **Themes** | Light (default), dark, dim |
| **Accessibility** | WCAG 2.2 AA, keyboard-complete, the map readable in text |
| **Mobile** | A separate overview layout: full-screen map, filters in a bottom sheet |
| **Quality** | oxlint + Biome + `tsc`, five test layers, Storybook |
| **Delivery** | Docker image, nginx config, and [`DEPLOYMENT.md`](DEPLOYMENT.md) |

### What it runs on

| | |
|---|---|
| Node | **24.21.0** — pinned in `.nvmrc`, enforced by `package.json#engines` |
| Package manager | pnpm, via Corepack |
| Browsers | Chromium, Firefox and WebKit; usable down to 360 px |

---

## What it does

- **A world map** with one dot per producing country, sized by output. Dots are
  real focusable controls; selecting one filters the summary to that country.
- **Bidirectional filtering.** Choosing a country narrows the product list to
  what that country actually produces, and vice versa. The narrowing is a real
  join through facilities and production records, not a hard-coded table.
- **A year range** anywhere inside 2010–2026.
- **A summary**: totals, the peak year, change across the range, and the
  breakdown by product and by country.
- **Excel export** of exactly what is on screen — same filters, same sort.
- **Full CRUD** for all seven entities, each with search, sorting, filtering and
  pagination held in the URL.
- **Roles and permissions**, with a read-only activity log of every change.
- **Four languages** (English, German, French, Polish) and **three themes**
  (light, dark, dim).

### Mixed units, handled honestly

Lithium is measured in tonnes, cells in millions of units, separator film in
km². When more than one product is in scope a single grand total would be a lie,
so the panel does not show one: it reports `mixed`, gives the per-product
breakdown instead, and sizes map dots by a **normalised intensity** — each
product's contribution scaled against its own maximum before summing. With one
product selected that reduces to `total / max`.

---

## There is no backend

Every request is intercepted by Mock Service Worker and served from an in-memory
dataset seeded at boot. State resets on reload; that is the documented
behaviour, not a defect.

The mock is not a stub: it re-checks permissions server-side on every request,
validates bodies against the same Zod schemas the forms use, and refuses a
delete that would orphan rows. Hiding a button does not stop a request, so the
API refuses it too.

One consequence is worth knowing before reading the auth code: the session
cookie carries every attribute a browser enforces, but **not `HttpOnly`** —
which only a real server can set. [`SECURITY.md`](SECURITY.md) sets out why, and
what was done instead.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TanStack Start in **SPA mode** (`ssr: false`) — Start is here for its Router integration |
| Architecture | Feature-Sliced Design, **enforced by the linter** |
| Server state | TanStack Query · **Client state** Zustand · **URL state** nuqs |
| HTTP | ofetch behind an injected `HttpClient` type |
| Mock API | MSW |
| Validation | Zod 4 — one schema per entity, the source of its TypeScript type |
| Styling | Tailwind v4, three themes via `data-theme`, all sizes in `rem` |
| Components | shadcn/ui on Base UI |
| Map | d3-geo + topojson, hand-rolled SVG — no map library |
| Lint | oxlint · **Format** Biome (its linter is off on purpose) |
| Tests | Vitest + Testing Library · **Stories** Storybook |

### Architecture is checked, not just described

`pnpm lint` fails on an upward import, a sibling import inside
`pages`/`widgets`/`features`, or any cross-slice import that bypasses a slice's
barrel. The rules live in `.oxlintrc.json`; the reasoning is in
[`.claude/rules/fsd.md`](.claude/rules/fsd.md).

---

## Commands

```bash
pnpm dev          # dev server
pnpm verify       # oxlint → biome → tsc
pnpm test           # unit, integration, snapshots and screenshots
pnpm test:unit      # unit specs
pnpm test:int       # integration specs
pnpm test:snapshot  # markup snapshots
pnpm test:screenshot # browser screenshot comparisons
pnpm storybook    # component workshop, all themes and languages
pnpm build        # production bundle
pnpm commit       # guided Conventional Commit
```

---

## Documentation

| Document | What is in it |
|---|---|
| [`PRODUCT.md`](PRODUCT.md) | What this is, who it is for, the data model, what is deliberately out of scope |
| [`DESIGN.md`](DESIGN.md) | Visual and interaction contract: themes, typography, the map's visual language |
| [`CODE_STYLE.md`](CODE_STYLE.md) | Naming, imports, size limits, what never appears in a diff |
| [`SECURITY.md`](SECURITY.md) | The session cookie, access control, and the `HttpOnly` limitation in full |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Running it locally, in Docker, and against a real API |
| [`CLAUDE.md`](CLAUDE.md) | Entry point for AI agents working in this repo |
| [`.claude/`](.claude/) | Project law: rules, skills, agents, commands |

---

## Licence

**Proprietary.** No use, copying, modification or distribution without the
owner's prior written permission — see [`LICENSE`](LICENSE). If this was shared
with you to evaluate the author's work, you may read it for that purpose and
that purpose only.
