# CLAUDE.md — supply-chain-admin-panel

Compact routing entrypoint. Read this first, then load only the rules whose **Paths** match
the files you are about to touch.

## What this is

A single-page operations panel that visualises **where a product is made, and how much**, on a
world map, for any year range between 2010 and 2026. Built as a take-home prototype; the
product brief lives in [`PRODUCT.md`](PRODUCT.md), the visual/interaction contract in
[`DESIGN.md`](DESIGN.md), and the mechanical style gates in [`CODE_STYLE.md`](CODE_STYLE.md).

There is **no backend**. Every request is intercepted by Mock Service Worker and served from an
in-memory dataset seeded at boot. The mock re-checks permissions server-side exactly as a real
API would, so the RBAC story is honest rather than cosmetic.

That constraint has one consequence worth knowing before you touch auth: the session cookie
carries every attribute a browser enforces, but **not `HttpOnly`** — which only a real server
can set. [`SECURITY.md`](SECURITY.md) explains why, and what was done instead.
Running it — locally, in Docker, or against a real API — is [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19 + TanStack Start (**SPA mode**) | Start is here for its Router integration only. `ssr: false`. |
| Routing | TanStack Router, file-based | `src/routes/` are thin adapters onto `src/pages/`. |
| Architecture | Feature-Sliced Design | `app → pages → widgets → features → entities → shared`. |
| Server state | TanStack Query | Never Zustand. |
| Client state | Zustand | Session, theme, sidebar. Nothing the server owns. |
| URL state | nuqs | Every filter, sort and page lives in the URL. |
| HTTP | ofetch | Wrapped behind the `HttpClient` type; services never import it. |
| Mock API | MSW | `src/app/mocks/`. |
| Validation | Zod 4 | One schema per entity, the source of its TypeScript type. |
| Forms | react-hook-form + zod resolver | |
| Styling | Tailwind v4 | Three themes via `data-theme`; light is the default. |
| Components | shadcn/ui (`base-vega`, Base UI) | Vendored into `src/shared/ui/`. |
| i18n | i18next + react-i18next | English, German, French, Polish. |
| Map | d3-geo + topojson + world-atlas | Hand-rolled SVG widget, no map library. |
| Lint | **oxlint** | The only linter. |
| Format | **Biome** | Formatter only — its linter is off on purpose. |
| Tests | Vitest + Testing Library | Four projects: `unit`, `integration`, `snapshot`, `screenshot`. |
| E2E | Playwright | `tests/e2e/*.e2e-spec.ts` — CRUD for every entity. |
| Stories | Storybook | One `*.stories.tsx` in each `shared/ui` component folder. `pnpm storybook`. |

## Non-negotiables

1. **Layers flow one way**, and `pnpm lint` enforces it.
   `app → pages → widgets → features → entities → shared`. A lower layer never imports an
   upper one; siblings never import each other inside `pages`/`widgets`/`features`. `src/app/mocks/` is the single place allowed to import
   entities from the app layer, because it *is* app initialisation.
2. **Cross-slice imports go through the barrel**, also enforced by `pnpm lint`.
   `@/entities/country`, never `@/entities/country/model/country.schema`. Inside a slice,
   relative paths are correct.
3. **Services take their transport as a parameter.** `createXService(http = httpClient)`.
   Nothing under `entities/*/api/` imports `ofetch` directly.
4. **Server state is React Query's.** If it came from the API, it does not go in Zustand.
5. **Filters live in the URL.** A screen's state must survive a reload and a paste into Slack.
6. **No `px` for type.** Every font size resolves to a `--typography-*` token, stated in `rem`.
7. **No string literal reaches the screen.** All user-visible copy goes through `t()`.
8. **Permissions are checked twice.** `hasPermission` hides UI; the mock API refuses the
   request. Adding a gated screen means doing both.
9. **Failures land where they can be acted on.** Global ones are a toast, wired once in the
   `MutationCache`. Per-field validation renders beside the input, with focus scrolled to it.
   Never a validation error in a toast.
10. **`any` is not available.** Neither is `@ts-expect-error` as a shortcut.
11. **Run the gates before you claim done**: `pnpm verify` (oxlint + biome + tsc) and
    `pnpm test`.

## Rule index

| Rule | Paths it governs |
|---|---|
| `.claude/rules/fsd.md` | `src/**` |
| `.claude/rules/code-principles.md` | `src/**/*.tsx` |
| `.claude/rules/typescript.md` | `src/**/*.ts`, `src/**/*.tsx` |
| `.claude/rules/react.md` | `src/**/*.tsx` |
| `.claude/rules/data-fetching.md` | `src/shared/api/**`, `src/entities/*/api/**` |
| `.claude/rules/forms.md` | `src/features/**`, `src/entities/*/model/*.schema.ts` |
| `.claude/rules/errors.md` | `src/**/*.tsx`, `src/shared/lib/errors.ts`, `src/app/providers/queryClient.ts` |
| `.claude/rules/styling.md` | `src/**/*.tsx`, `src/app/styles/**` |
| `.claude/rules/a11y.md` | `src/**/*.tsx` |
| `.claude/rules/i18n.md` | `src/shared/i18n/**`, `src/**/*.tsx` |
| `.claude/rules/rbac.md` | `src/entities/access/**`, `src/app/mocks/handlers/**`, `src/routes/**` |
| `.claude/rules/mocking.md` | `src/app/mocks/**` |
| `.claude/rules/testing.md` | `**/*.unit-spec.*`, `**/*.int-spec.*` |
| `.claude/rules/code-style.md` | `**/*` (commit/PR time) |
| `.claude/rules/commit-style.md` | `**/*` (commit time) |
| `.claude/rules/architecture-checklist.md` | `**/*` (review time) |

## Skill index

| Skill | Load it when |
|---|---|
| `.claude/skills/fsd/SKILL.md` | Creating any new slice — do not hand-roll the tree. |
| `.claude/skills/oxlint-biome/SKILL.md` | A lint or format gate fails. |
| `.claude/skills/msw/SKILL.md` | Adding or changing a mock endpoint. |
| `.claude/skills/tanstack-router/SKILL.md` | Adding a route, a guard, or a page title. |

## Commands

| Command | What it does |
|---|---|
| `/sc-implement "<task>"` | Implement a change end to end, then run the gates. |
| `/sc-review` | Walk the architecture checklist over the current diff. |

## Mechanical gates

```bash
pnpm lint        # oxlint
pnpm check       # biome (format + import order)
pnpm typecheck   # tsc --noEmit
pnpm verify      # all three
pnpm test        # vitest: unit + integration + snapshot + screenshot
```

Run individual projects with `pnpm test:unit`, `pnpm test:int`,
`pnpm test:snapshot`, or `pnpm test:screenshot`. The default run includes
screenshots and requires installed Playwright browsers. `pnpm test:e2e` and
`pnpm test:stories` run separately.

"Green" means every one of them exited zero. Say so plainly, or say which failed.

## Vocabulary

Words used precisely throughout this repo are defined once in
[`.claude/CONTEXT.md`](.claude/CONTEXT.md). Use them; a synonym makes a grep miss.

## Licence

This code is **proprietary**. See [`LICENSE`](LICENSE) — no use, copying, or distribution
without the owner's written permission.
