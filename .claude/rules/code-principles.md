---
name: code-principles
description: SOLID, DRY and KISS as they apply here, plus the hard limits that follow — 100 logic lines per .tsx, 5 own declared props — and where each extracted concern belongs when a component outgrows them. Use whenever writing or reviewing a React component, deciding how to split one, or judging whether an abstraction earns its place.
globs:
  - "src/**/*.tsx"
  - "src/**/*.ts"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Code principles

Owns SOLID/DRY/KISS and the size limits. Where this overlaps `react.md` or `typescript.md`,
the more specific file wins.

## SOLID, concretely

- **Single responsibility** — one reason to change. A component that renders, fetches *and*
  transforms is three responsibilities: `ui/` renders, `api/` fetches, `lib/` transforms.
- **Open/closed** — extend by composition and parameters, not by editing a shared thing to
  satisfy one caller. `createCrudService` and `createResourceHandlers` are the worked example:
  a new resource is a config object, never an edit to the factory.
- **Liskov** — a wrapper honours the wrapped element's contract: forwards `ref`, accepts
  `className`, keeps the event surface, keeps the ARIA role.
- **Interface segregation** — never force a consumer to depend on what it does not use.
  `ReadableService` and `WritableService` are split for exactly this reason, and the audit
  trail implements only the readable half. The MSW factory asks for a `Parser` (`safeParse`)
  rather than a whole `ZodType`, for the same reason.
- **Dependency inversion** — depend on an abstraction passed in, not a concrete reached for.
  Every service takes `http: HttpClient`. `shared/api` reads the auth token through a
  registered provider instead of importing the session store, which would also invert the
  layer order.

## DRY

Three near-identical blocks → extract. **Search before writing**: check `shared/ui/`,
`shared/lib/`, `shared/hooks/` and the existing `create*` factories first.

Never duplicate a Zod schema. A feature imports the entity's schema; it does not restate it.

## KISS

The simplest thing that satisfies the requirement. No configuration layer for one consumer, no
speculative generality. If 200 lines do what 50 can, write the 50.

## File size — 100 lines is the nudge, 200 is the limit

Applies to **every** first-party `.ts` and `.tsx` file, not only components.

| Length | What it means |
|---|---|
| ≤ 100 lines | Fine. |
| 101–200 lines | **Try to decompose.** Look for the seam; if there genuinely is not one, leave it and say why in a comment. |
| > 200 lines | **Decompose. Not optional.** A file this long has more than one job, and review will reject it. |

Lines are counted whole — a 300-line file is 300 lines whether they are data, types or logic.

### Data files decompose too

A seed dataset or a translation dictionary is not exempt. Split it by what it describes:
`seed/countries.ts`, `seed/products.ts`, `seed/facilities.ts` — one concern per file, an
`index.ts` that composes them.

### The one exception: vendored components

`src/shared/ui/**` holds shadcn components copied in verbatim. They are **not** restructured,
however long they are, because `shadcn add` must be able to overwrite them cleanly and a local
split would be lost on the next update. Treat them as third-party source that happens to live
in the repo.

Each one has a folder of its own — `button/button.tsx` plus its four specs, its stories and an
`index.ts` that re-exports it. The component file stays exactly as vendored; everything beside
it is ours. The barrel is what keeps `@/shared/ui/button` resolving either way.

## Component size — ≤100 logic lines per `.tsx`

**Logic lines** = non-blank, non-comment lines. This is the stricter limit components carry on
top of the file-size rule above.

When a component outgrows it, extract in this order:

1. **Data** → a `queryOptions` call or a `use*` hook in the slice's `api/`.
2. **Derivation** → a pure function in the slice's `lib/`.
3. **Sub-sections** → child components in the same `ui/` directory.
4. **Static config** → a `config/` file (column definitions, nav items).

## Props — ≤5 own declared props

Props the component *declares itself*; spread-through HTML attributes do not count.

Past five, the component is doing more than one job. Group related props into one object, or
accept `children` / a render slot instead of a pile of flags.

```tsx
// ❌ eight flags
<DataTable sortable searchable paginated exportable compact bordered striped hoverable />

// ✅ one contract
<DataTable columns={columns} query={query} toolbar={<ExportButton />} />
```

## Comments

Explain **why**, never **what**. A comment restating the code is noise; a comment recording a
constraint, a trade-off or a non-obvious reason earns its place and must be kept true when the
code changes.
