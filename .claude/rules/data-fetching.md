---
name: data-fetching
description: How data flows — the HttpClient seam, functional service factories, the createCrudService/createCrudQueries pair, cache keys, the meta.invalidates convention, and the boundary between React Query and Zustand. Use whenever adding an endpoint, a service, a query, or a mutation.
globs:
  - "src/shared/api/**"
  - "src/entities/*/api/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Data fetching

## The seam

```
component → use*Hook → queryOptions → service → HttpClient → ofetch → MSW
```

Every arrow is one-way, and every service depends on the **`HttpClient` type**, never on
`ofetch`:

```ts
export const createCountryService = (http: HttpClient = httpClient): CountryService =>
  createCrudService({ http, resource: 'countries' })
```

The default parameter is the production wiring; a test passes its own function and needs no
mocking framework at all.

## Services are functional

A factory returning an object of async functions. **Never a class.** No inheritance, no `this`,
no decorators.

Extend by spreading, not by editing the factory:

```ts
export const createFacilityService = (http: HttpClient = httpClient) => ({
  ...createCrudService<Facility, FacilityCreateInput, FacilityUpdateInput>({
    http,
    resource: 'facilities',
  }),
  // resource-specific method goes here
})
```

## Queries

`createCrudQueries({ resource, service })` produces the cache keys and the option objects.
Never hand-write a query key.

Key hierarchy, so a broad invalidation catches the narrow ones:

```
[resource]                    → everything for this resource
[resource, 'list', query]     → one filtered list
[resource, 'detail', id]      → one row
```

## Mutations invalidate declaratively

A mutation carries what it invalidates in `meta.invalidates`. A single `MutationCache`
subscriber in the app layer performs the invalidation.

```ts
createOptions: () => ({
  mutationFn: (input: TCreate) => service.create(input),
  meta: { invalidates: keys.all },
})
```

**Do not** call `queryClient.invalidateQueries` from a component. If a mutation needs to
invalidate something outside its own resource, widen `meta.invalidates`.

## React Query vs Zustand

| State | Where |
|---|---|
| Anything the API returned | React Query. Always. |
| Auth token and the role it grants | Zustand (`sessionStore`), persisted |
| Theme, sidebar | Zustand (`themeStore`, `uiStore`), persisted |
| Filters, sort, page, search | **The URL**, via nuqs |
| Open/closed dialog, focused row | `useState` |

Copying server data into Zustand is the mistake this table exists to prevent.

## Errors

`httpClient` normalises every failure into `ApiError` with `status` and the parsed `body`. A
`401` fires the registered unauthorized handler, which clears the session and sends the
operator to `/login`.

Components read `error.status` to choose the message; they never parse a response themselves.

## List queries

Every list endpoint accepts the same envelope — `search`, `page`, `pageSize`, `sortBy`,
`sortDir`, and an open `filters` bag. Serialisation lives once in `toSearchParams`.

`pageSize: 0` means "everything", and exists for the selects that must list all options.
