---
name: architecture-checklist
description: The mechanical review pass — a numbered checklist walked over every diff before it is called done, covering layers, data flow, access control, i18n, accessibility, styling, tests and docs. Use at review time, and before reporting a task complete.
globs:
  - "**/*"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Architecture checklist

Walk every row against the diff. A row is **pass**, **fail**, or **n/a** — never "probably".
Cite `file:line` for each fail.

Rows marked 🤖 are **enforced by `pnpm lint`** — oxlint's `no-restricted-imports`, scoped per
layer in `.oxlintrc.json`. You do not need to eyeball them; you do need `pnpm lint` to have
actually run (see the `oxlint-biome` skill on why a green exit is not always proof).

## Layers

| # | Check |
|---|---|
| FSD-1 🤖 | No import flows upward (`shared` → `entities` → … → `app`). |
| FSD-2 🤖 | No sibling import inside `pages`, `widgets` or `features`. |
| FSD-3 🤖 | Every cross-slice import goes through the slice barrel. |
| FSD-4 | The barrel exports the public surface only — no slice internals leaked. |
| FSD-5 | New slices match the templates in `.claude/templates/`. |
| FSD-6 | `src/routes/*` files are thin: path, guard, title, render a page. |

## Data

| # | Check |
|---|---|
| DATA-1 🤖 | Services take `http: HttpClient` as a parameter; nothing imports `ofetch` outside `shared/api`. |
| DATA-2 | No hand-written query key — `createCrudQueries` owns them. |
| DATA-3 | No `invalidateQueries` in a component; invalidation is declared in `meta.invalidates`. |
| DATA-4 | Nothing the API returned was copied into Zustand. |
| DATA-5 | Filters, sort, page and search live in the URL via nuqs. |
| DATA-6 | UI calls a `use*` hook, not a raw `useQuery(...)`. |

## Access

| # | Check |
|---|---|
| RBAC-1 | Every gated capability has **both** halves: `hasPermission` and `authorize`. |
| RBAC-2 | A new permission is in the union, `PERMISSIONS`, `PERMISSION_GROUPS` and all four locales. |
| RBAC-3 | Every mutating handler records an audit entry. |
| RBAC-4 | The audit trail has no write surface. |
| RBAC-5 | Navigation is filtered so no link leads to a refused page. |

## Presentation

| # | Check |
|---|---|
| I18N-1 | No user-visible literal — including `aria-label`, `title`, `placeholder`, page titles. |
| I18N-2 | Keys exist in all four locales; `tsc` proves it. |
| I18N-3 | Numbers and dates go through the `Intl` helpers, never hand-formatted. |
| A11Y-1 | Semantic element used; ARIA only where no element carries the meaning. |
| A11Y-2 | Everything mouse-reachable is keyboard-reachable; focus is visible. |
| A11Y-3 | Every control has an accessible name; errors use `aria-describedby` + `aria-invalid`. |
| A11Y-4 | Meaning is never carried by colour alone. |
| A11Y-5 | The map's data is also available in text form. |
| CSS-1 | No hard-coded colour — semantic tokens only. |
| CSS-2 | No `px` font size and no arbitrary type value; `typo-*` utilities only. |
| CSS-3 | A new token exists in **all three** themes plus `@theme inline`. |
| CSS-4 | Usable at 360 px. |

## Craft

| # | Check |
|---|---|
| SIZE-1 | No first-party `.ts`/`.tsx` over 200 lines. 101–200 carries a reason. |
| SIZE-2 | No `.tsx` over 100 logic lines. |
| SIZE-3 | No component declaring more than 5 own props. |
| SIZE-4 | `src/shared/ui/**` untouched by the above — vendored, exempt. |
| TS-1 | No `any`, no suppression comment without a named reason. |
| TS-2 | Domain types are inferred from their schema, not restated. |
| DRY-1 | Nothing duplicated that an existing factory, hook or token already covers. |
| CMT-1 | Comments say why, not what, and are still true after the change. |

## Verification

| # | Check |
|---|---|
| GATE-1 | `pnpm verify` green. |
| GATE-2 | `pnpm test` green. |
| GATE-3 | New behaviour has a test at the right layer (`testing.md`). |
| GATE-4 | `shared/ui` additions have a story. |
| DOC-1 | A changed convention is reflected in `CLAUDE.md`, the rule, and the docs that restate it. |

## Goal

| # | Check |
|---|---|
| GOAL-1 | The change does what was asked — re-read the request and say how each part is met. |
| GOAL-2 | Anything deliberately left out is named, with the reason. |
