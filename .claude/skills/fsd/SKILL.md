---
name: fsd
description: Canonical slice scaffolding for this panel — the tree every new entity, feature, widget and page starts from, what each generated file contains, and when to add a service, a store or a schema versus leaving the segment out. Use whenever creating a new slice under src/entities, src/features, src/widgets or src/pages, or before hand-rolling any of those directories.
metadata:
  version: "1.0.0"
  type: workflow
  author: lordpluha
license: SEE LICENSE IN LICENSE
---

# FSD scaffold

`.claude/templates/` is the canonical shape. Do not hand-roll the initial tree.

Placeholders: `__NameKebab__`, `__NameCamel__`, `__NamePascal__`.

## Entity

```text
entities/<name-kebab>/
  api/
    <nameCamel>Service.ts    createXService(http = httpClient) → CrudService
    <nameCamel>Queries.ts    createCrudQueries({ resource, service })
  model/
    <nameCamel>.schema.ts    Zod schema + Create/Update derivations + inferred types
  lib/                       only if the slice has pure helpers
  ui/                        only if the entity has presentational bits of its own
  index.ts                   barrel
```

The schema is the source of truth: `Entity`, `EntityCreateInput` and `EntityUpdateInput` are
all `z.infer`, never hand-written.

Both `api/` files are three lines of wiring each. If the entity needs a method beyond CRUD,
spread the factory result and append — never edit `createCrudService`.

Add a Zustand store (`model/<nameCamel>Store.ts`) **only** for client state. Anything the API
returned belongs to React Query.

A read-only entity (like `audit-entry`) implements `ReadableService` and gets no mutation
bindings at all.

## Feature

```text
features/<name-kebab>/
  ui/<NamePascal>.tsx
  model/<nameCamel>.types.ts   component props, local state types
  lib/                         only if it has pure helpers
  index.ts
```

A feature imports the entity's schema; it does not restate one. It declares its own schema only
for a shape no entity owns — a filter bar, a search form.

## Widget

```text
widgets/<name-kebab>/
  ui/<NamePascal>.tsx
  config/                      static data: column defs, nav items
  index.ts
```

Widgets compose features, entities and shared. No `model/` or `api/` by default — if a widget
needs its own data call, it probably wanted to be a feature.

## Page

```text
pages/<name-kebab>/
  ui/<NamePascal>Page.tsx
  index.ts
```

Pages assemble widgets for one route and hold no business logic. The matching file in
`src/routes/` stays a thin adapter: path, guard, document title, render the page.

## After scaffolding

1. Wire the barrel export where consumers need it.
2. Add the four locale keys if the slice renders any copy.
3. If it is gated, add **both** halves of the permission (see `rbac.md`).
4. Add the mock handler if it is a new resource — `createResourceHandlers`, not a hand-rolled one.
5. Write the spec the `testing.md` table calls for.

## Evolving the convention

Change `.claude/templates/` first, then this skill, then checklist row **FSD-5** — in the same
commit.
