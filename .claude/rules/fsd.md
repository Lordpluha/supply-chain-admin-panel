---
name: fsd
description: Feature-Sliced Design for src/ — the layer order imports may flow in, the cross-layer permission matrix, slice anatomy, the barrel rule, and the one documented exception for the mock API. Use whenever adding a file, creating a slice, moving code between slices, or resolving a layer-boundary question.
globs:
  - "src/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# FSD architecture

Read before adding a file, moving code between slices, or creating a slice.

## Layer order

Imports flow **downward only**. Upper layers consume lower ones; lower layers never reach up.

```
app → pages → widgets → features → entities → shared
```

| Layer | What lives here |
|-------|-----------------|
| `app/` | Composition root: providers, the query client, global styles, the MSW bootstrap. |
| `pages/` | One slice per route. Assembles widgets and features. No business logic. |
| `widgets/` | Reusable page sections that know the domain: `app-shell`, `world-map`, `production-summary`, `entity-crud`. |
| `features/` | A user interaction and the UI that triggers it: `auth/login-form`, `supply-filters`, `switch-theme`, `switch-language`, `entity-crud`. |
| `entities/` | Domain objects: schema, service, queries, store, presentational bits. |
| `shared/` | Tech-agnostic: `api/`, `ui/`, `lib/`, `store/`, `config/`, `i18n/`, `hooks/`. |

`src/routes/` sits outside the cake. A route file declares the path, the guard and the title,
then renders a page slice — nothing else.

## Permission matrix

| From ↓ / May import → | app | pages | widgets | features | entities | shared |
|---|---|---|---|---|---|---|
| `app` | – | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pages` | ❌ | sibling ❌ | ✅ | ✅ | ✅ | ✅ |
| `widgets` | ❌ | ❌ | sibling ❌ | ✅ | ✅ | ✅ |
| `features` | ❌ | ❌ | ❌ | sibling ❌ | ✅ | ✅ |
| `entities` | ❌ | ❌ | ❌ | ❌ | sibling ⚠️ | ✅ |
| `shared` | ❌ | ❌ | ❌ | ❌ | ❌ | internal ✅ |

**Sibling imports are forbidden** inside `pages`, `widgets` and `features`: if two slices need
the same thing, it belongs one layer down.

⚠️ **Entities may import siblings**, but only a schema or a type, and only where the domain
genuinely composes — `session` imports `role`'s `permissionSchema`; `production-record`'s
analytics types reference nothing at all. Never import another entity's *service* or *store*.

### The one exception

`src/app/mocks/` imports entity schemas and types. That is legal because the mock API **is**
app initialisation — it is wired up in the composition root and never ships as a dependency of
a lower layer. Do not take it as licence to import entities from anywhere else in `shared/`.

## Slice anatomy

```
<slice>/
  ui/        React components owned by this slice
  model/     Zod schemas, derived types, Zustand stores
  api/       Service factory + React Query bindings
  lib/       Slice-internal pure helpers
  config/    Static data (nav links, column defs)
  index.ts   Public barrel — the ONLY legal cross-slice import target
```

Create only the segments the slice needs. An empty `lib/` is noise.

## The barrel rule

```ts
// ✅
import { countryQueries, type Country } from '@/entities/country'

// ❌ reaches past the barrel
import { countrySchema } from '@/entities/country/model/country.schema'

// ❌ relative path across a slice boundary
import { Country } from '../../entities/country'
```

Inside a slice, relative imports are correct and preferred: `./country.schema`, `../model`.

The barrel exports the public surface and nothing more. If a helper is only used inside the
slice, it does not appear in `index.ts`.

## Where does it go?

- Fetches or writes a domain object → that entity's `api/`.
- Describes a domain object's shape → that entity's `model/*.schema.ts`.
- Pure transformation with no React → `lib/`, in the lowest layer that uses it.
- Used by exactly one slice → inside that slice.
- Used by two slices in the same layer → push it **down** a layer, do not import sideways.
- Shared UI primitive with no domain knowledge → `shared/ui/`.

## These rules are enforced, not just written down

`pnpm lint` fails on every one of them. oxlint's `no-restricted-imports` is scoped per layer in
`.oxlintrc.json`, so the layer a file sits in decides what it may import:

| Violation | What you get |
|---|---|
| `shared/` importing `entities/` | *"'shared' is the bottom layer and may not import from any layer above it."* |
| `features/` importing `widgets/` | *"'features' may import only 'entities' and 'shared'."* |
| `features/a` importing `features/b` | *"sibling imports are forbidden … it belongs one layer down."* |
| `@/entities/country/model/country.schema` | *"Cross-slice imports go through the slice barrel."* |

The barrel rule applies to **every** layer including `app/` and `routes/`, which may import
anything but still only through a slice's public surface.

Relative imports are untouched on purpose: inside a slice, `./country.schema` is correct.

Adding a layer means adding its override. A rule nobody can trip is decoration — after
changing one, prove it fires by writing the violation, running `pnpm lint`, and deleting it
again.

## Creating a slice

Use the `fsd` skill (`.claude/skills/fsd/SKILL.md`) and the trees under `.claude/templates/`.
Do not hand-roll the initial directory.
