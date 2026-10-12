---
name: typescript
description: TypeScript conventions — no production any, named types over inline shapes, Zod as the single source of truth for domain types, type-only imports, and what to do instead of a suppression comment. Use whenever writing or reviewing any .ts/.tsx file, or when tsc fails.
globs:
  - "src/**/*.ts"
  - "src/**/*.tsx"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# TypeScript

`strict` is on, along with `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch` and `verbatimModuleSyntax`. Do not relax `tsconfig.json`.

## `any` is not available

Not in production code, not "temporarily". `oxlint` fails the build on it.

Reach for, in order: the real type → a generic → `unknown` plus a narrowing check.

```ts
// ❌
const body = (await request.json()) as any

// ✅ — parse it, and the type falls out
const parsed = countryCreateSchema.safeParse(await request.json())
if (!parsed.success) return badRequest('Validation failed')
// parsed.data is CountryCreateInput
```

## No suppression shortcuts

`@ts-ignore`, `@ts-expect-error` and `eslint-disable`/`oxlint-disable` are not how a type error
gets resolved. If one is genuinely unavoidable, it carries a comment naming the upstream
limitation and, where one exists, the issue link.

The one sanctioned cast in this codebase is the narrow `as Record<string, unknown>` on a
request body, where `ofetch`'s `body` type is wider than our generic can express. It is
commented in place.

## Zod is the source of truth

A domain type is **derived**, never hand-written beside its schema:

```ts
export const countrySchema = z.object({ /* … */ })
export type Country = z.infer<typeof countrySchema>
```

Create/update inputs derive too — `.omit({ id: true })`, `.partial()`. Never restate a shape
that a schema already describes.

Hand-written `interface`s are correct for things that never cross the wire as input: response
projections (`ProductionRecordRow`), analytics shapes, component props.

## Named types over inline shapes

```ts
// ❌
const render = (p: { id: string; label: string; onPick: (id: string) => void }) => …

// ✅
export interface OptionProps {
  id: string
  label: string
  onPick: (id: string) => void
}
```

Inline object types are acceptable only for a one-line local.

## Type-only imports

`verbatimModuleSyntax` means the distinction is load-bearing:

```ts
import { createCrudService } from '@/shared/api'
import type { HttpClient } from '@/shared/api'
```

oxlint enforces `separate-type-imports`.

## Unions over booleans

Two booleans that cannot both be true are a union with a name:

```ts
// ❌
{ isLoading: boolean; isError: boolean }

// ✅
type Status = 'idle' | 'loading' | 'error' | 'ready'
```

Exhaustive `switch` over a union, with a `never` default, beats a chain of `if`s — the compiler
then tells you when the union grows.

## Exhaustiveness

Where a union must be mirrored into a value (the permission catalogue), prove the coverage at
compile time rather than trusting review. `PERMISSIONS` in `entities/access` is the pattern.
