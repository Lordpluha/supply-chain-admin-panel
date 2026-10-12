---
name: tanstack-router
description: Recipes for routing here — adding a route, the pathless _authed layout, permission guards in beforeLoad, per-page document titles through head(), typed search params bridged to nuqs, and why Start runs in SPA mode. Use whenever adding a route, a guard, or a page title.
metadata:
  version: "1.0.0"
  type: workflow
  author: lordpluha
license: SEE LICENSE IN LICENSE
---

# TanStack Router recipes

File-based routing under `src/routes/`. `routeTree.gen.ts` is generated — never edit it.

TanStack Start is here **only** for its Router integration: `spa: { enabled: true }` in
`vite.config.ts` turns SSR off and prerenders one static shell. Do not add a server function or
a loader that assumes a server.

## Route files are thin

A route declares four things and renders a page slice:

```tsx
export const Route = createFileRoute('/_authed/countries')({
  beforeLoad: requirePermission('countries:read'),
  head: () => ({ meta: [{ title: pageTitle('countries.title') }] }),
  component: CountriesPage,
})
```

Markup, data wiring and state belong in `src/pages/<slice>/`, not here.

## The `_authed` layout

`_authed` is a **pathless** layout route: it contributes no URL segment, but everything under
it inherits its guard and the app shell. `/login` sits outside it.

```
routes/
  __root.tsx          providers, shell document, error and 404 boundaries
  login.tsx           public
  _authed.tsx         guard + app shell
  _authed/index.tsx   → /            dashboard
  _authed/countries.tsx → /countries
```

## Guards

`beforeLoad` runs before the component and can redirect, so an unauthorised operator never
sees a flash of the page.

Two distinct outcomes, and they must stay distinct:

- **Not signed in** → redirect to `/login`, carrying the attempted path so the operator lands
  where they meant to go.
- **Signed in, lacking the permission** → the `noAccess` screen. Not a 404 — the page exists,
  and the operator needs to know to ask for access rather than think it is gone.

The guard is only half of the gate; the MSW handler refuses the request regardless. See
`rbac.md`.

## Page titles

Every route sets one through `head()`. The title is a **translation key**, resolved at render,
so it follows the active language:

```tsx
head: () => ({ meta: [{ title: pageTitle('dashboard.title') }] })
```

`pageTitle` appends the product name. A route without a title fails review.

## Search params and nuqs

nuqs owns reading and writing filter state; the router owns the type contract. Bridge them with
`createStandardSchemaV1` so both agree:

```tsx
const searchParams = { countryId: parseAsString, productId: parseAsString }

export const Route = createFileRoute('/_authed/')({
  validateSearch: createStandardSchemaV1(searchParams, { partialOutput: true }),
})
```

`partialOutput: true` keeps values optional, matching nuqs's default behaviour.

`NuqsAdapter` from `nuqs/adapters/tanstack-router` wraps the tree once, in `__root.tsx`.

## Adding a route

1. Create the file under `src/routes/`; the plugin regenerates the tree on save.
2. Create the page slice under `src/pages/` (use the `fsd` skill).
3. Add the guard if it is gated — **and** the handler-side permission.
4. Add the title key to all four locales.
5. Add the sidebar entry, filtered by the same permission, so navigation never offers a dead end.
