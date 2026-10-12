# CODE_STYLE.md

How code in this repository is written. The operational half — which command to run, how to
read its output — lives in [`.claude/rules/code-style.md`](.claude/rules/code-style.md). This
file is the prose behind it.

## The gates

```bash
pnpm lint        # oxlint       — correctness
pnpm check       # biome        — formatting + import order
pnpm typecheck   # tsc --noEmit — types
pnpm test        # vitest       — behaviour (unit + integration + snapshot)
pnpm verify      # the first three
```

Green means every one exited zero. Anything else gets named, not glossed.

## Two tools, no overlap

Biome is a linter *and* a formatter. Running its linter alongside oxlint would report the same
problem twice under two different rule names, so the split is deliberate and absolute:

- **oxlint is the only linter.** `.oxlintrc.json`.
- **Biome is the formatter only.** `"linter": { "enabled": false }` in `biome.json`. Do not
  turn it on.

ESLint and Prettier were removed. Do not bring them back.

## Formatting

Set once, in `biome.json`, and never restated in an editor config that can drift:

| Setting | Value |
|---|---|
| Quotes | single |
| Semicolons | as needed (i.e. none) |
| Trailing commas | all |
| Line width | 100 |
| Indent | 2 spaces |
| Arrow parens | omitted for a single argument |

A `PostToolUse` hook formats every file on save, so formatting should never reach a commit
wrong.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Directory (slice) | kebab-case | `production-record/` |
| Component file | kebab-case or PascalCase per layer | `world-map.tsx`, `WorldMap.tsx` |
| Component | PascalCase | `ProductionSummary` |
| Hook | `use` + camelCase | `useAllCountries` |
| Factory | `create` + PascalCase | `createCrudService` |
| Service instance | camelCase | `countryService` |
| Schema | camelCase + `Schema` | `countryCreateSchema` |
| Type / interface | PascalCase, no `I` prefix | `Country`, `HttpClient` |
| Constant | SCREAMING_SNAKE | `YEAR_MAX`, `PERMISSIONS` |
| Boolean | `is` / `has` / `can` | `isPending`, `hasPermission` |
| Event handler | `handle` + event | `handleSelect` |
| Handler prop | `on` + event | `onSelect` |

Names come from the domain, not from the implementation. `facilities`, not `items`.
`ProductionRecord`, not `DataRow`. The vocabulary is fixed in
[`.claude/CONTEXT.md`](.claude/CONTEXT.md) — use those words and a grep will find what it
should.

## Imports

Biome orders them. Within a file the shape is:

```ts
import { useMemo } from 'react'                      // external
import { useTranslation } from 'react-i18next'

import { countryQueries } from '@/entities/country'  // internal, aliased
import { cn } from '@/shared/lib/cn'

import { formatOutput } from './lib/format'          // relative, inside the slice
import type { WorldMapProps } from './model/types'
```

- **Cross-slice → the barrel, through `@/`.** `@/entities/country`, never
  `@/entities/country/model/country.schema`, never `../../entities/country`.
- **Inside a slice → relative.** `./country.schema` is correct and preferred.
- **Type-only imports are separate.** `verbatimModuleSyntax` makes the distinction real, and
  oxlint enforces `separate-type-imports`.

## Functions over classes

There is not a single `class` in `src/` outside `ApiError`, which extends `Error` because that
is how errors work in JavaScript.

Services are factories returning plain objects of async functions. No `this`, no inheritance,
no decorators, no DI container.

```ts
export const createCountryService = (http: HttpClient = httpClient): CountryService =>
  createCrudService({ http, resource: 'countries' })
```

The default parameter is the production wiring. A test passes its own function, and needs no
mocking framework — which is the whole point of putting the seam there.

## Extend by composition

Shared factories are **closed for modification**. A new resource is a config object:

```ts
...createResourceHandlers({ resource: 'suppliers', collection: db.suppliers, /* … */ })
```

If you find yourself editing `createCrudService` or `createResourceHandlers` to satisfy one
caller, the parameter you need is missing — add the parameter, do not special-case the caller.

## Size limits

- **≤100 lines** per first-party `.ts`/`.tsx` file is the target; **101–200 means look for the
  seam**; **over 200 must be decomposed**. Data files — seeds, dictionaries — are not exempt.
- **≤100 logic lines** per `.tsx` (non-blank, non-comment) on top of that.
- **≤5 own declared props** per component. Spread-through HTML attributes do not count.

`src/shared/ui/**` is exempt: those are shadcn components vendored verbatim — one folder each,
holding the component, its four specs, its stories and a barrel — and splitting one
would be undone by the next `shadcn add`.

When a component outgrows them, extract in this order: data → a hook in `api/`; derivation → a
pure function in `lib/`; sub-sections → child components; static config → `config/`.

These are not arbitrary. A component that needs eight props is making eight decisions, and
those decisions belong to eight different places.

## Comments

Explain **why**. Never **what**.

```ts
// ❌ restates the code
// Loop over the records and sum the values
for (const record of records) total += record.value

// ✅ records a constraint the reader cannot see
// Scaled against each product's own maximum first: a country making 90 000 t of
// lithium must not drown out one making 400 M cells.
```

A comment that is no longer true is worse than no comment. Update it or delete it with the
code it describes.

JSDoc on anything exported from a barrel — one sentence on what it is for, not a restatement
of its signature.

## TypeScript

`strict`, plus `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
`verbatimModuleSyntax`. Do not relax them.

- **No `any`.** Parse it with a schema, or take `unknown` and narrow.
- **No suppression comments** without a named upstream reason.
- **Domain types are inferred from their schema**, never written twice.
- **Named types over inline shapes**, except for a one-line local.
- **Unions over boolean pairs**, with an exhaustive `switch` and a `never` default.

## What never appears in a diff

| Never | Instead |
|---|---|
| `any` | a schema, a generic, or `unknown` + narrowing |
| `@ts-expect-error` as a shortcut | fix the type |
| A hard-coded colour | a semantic token |
| `import { cn } from 'cn'` in first-party code | `@/shared/lib/cn` |
| A `px` font size | a `typo-*` utility |
| A user-visible literal | `t('…')` |
| `console.log` in `src/` | delete it (allowed in `app/mocks/` and config) |
| `queryClient.invalidateQueries` in a component | `meta.invalidates` |
| A hand-written query key | `createCrudQueries` |
| Server data copied into Zustand | React Query owns it |
| `--no-verify` | fix the hook |
| An edit to `routeTree.gen.ts` | edit the route file |

## Commits

Conventional Commits, enforced by commitlint. Run `pnpm commit` for the guided prompt. Full
vocabulary in [`.claude/rules/commit-style.md`](.claude/rules/commit-style.md).

```
feat(map): filter the summary when a country dot is selected
fix(auth): clear the session when the API returns 401
```
