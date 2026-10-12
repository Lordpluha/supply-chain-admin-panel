---
name: msw
description: Recipes for the mock API — adding a CRUD resource through the factory, writing a hand-rolled handler correctly, the permission and audit obligations, how the query envelope arrives, debugging an unintercepted request, and the boot-order race. Use whenever touching src/app/mocks.
metadata:
  version: "1.0.0"
  type: workflow
  author: lordpluha
license: SEE LICENSE IN LICENSE
---

# MSW recipes

Project law is `.claude/rules/mocking.md`. This is the how-to.

## Add a CRUD resource

Four edits, in order:

1. **Collection** — `src/app/mocks/db.ts`, with its searchable fields and filter predicates:

   ```ts
   suppliers: createCollection<Supplier>('supplier', seed.suppliers, {
     searchable: ['name', 'countryId'],
     filters: { countryId: (item, value) => item.countryId === value },
   }),
   ```

   Add it to the `MockDb` interface too — the explicit annotation is what breaks the circular
   inference between `db` and the helper functions above it.

2. **Handlers** — `handlers/index.ts`, through the factory:

   ```ts
   ...createResourceHandlers<Supplier>({
     resource: 'suppliers',
     collection: db.suppliers,
     auditEntityType: 'supplier',
     readPermission: 'suppliers:read',
     writePermission: 'suppliers:write',
     createSchema: supplierCreateSchema,
     updateSchema: supplierUpdateSchema,
     label: supplier => supplier.name,
   })
   ```

3. **Permissions** — the union, `PERMISSIONS`, `PERMISSION_GROUPS`, and the four locales.
4. **Audit type** — `AUDIT_ENTITY_TYPES` plus its label in the four locales.

You get list/get/create/update/delete, each permission-checked, schema-validated and audited.

## Hand-rolled handler

Only when the shape genuinely is not CRUD. It still owes four things:

```ts
http.get(`${env.apiBaseUrl}/analytics/summary`, async ({ request }) => {
  await latency()                                        // 1. exercise loading states
  const auth = authorize(request, 'dashboard:read')      // 2. real permission check
  if ('response' in auth) return auth.response
  // 3. validate any body with a schema before touching db
  // 4. recordAudit(...) if it mutates
  return HttpResponse.json(buildSummary(readFilters(new URL(request.url))))
})
```

## The query envelope

`toSearchParams` flattens `ListQuery` onto the wire; `parseListQuery(url)` rebuilds it. Anything
not in `search|page|pageSize|sortBy|sortDir` lands in `filters`.

A filter only works if the collection declares a predicate for that key. A filter the client
sends and the collection ignores fails **silently** — that is the first thing to check when a
filter "does nothing".

## Mutual filtering

`?productId=…` on `/countries` returns only countries producing it, and `?countryId=…` on
`/products` only products made there. Both are predicates in `db.ts` that walk
`facilities → records`. This is what makes the dashboard's either-order selection work without
a bespoke endpoint.

## Debugging

| Symptom | Cause |
|---|---|
| Request hits the network, not the worker | `enableMocking()` did not resolve before first render, or `public/mockServiceWorker.js` is missing — re-run `npx msw init public/`. |
| 401 on everything | No `Authorization` header — the token provider was not registered in the app layer. |
| 403 on one route | Real, and correct: the role lacks the permission. Check the **UI** half exists too. |
| Filter ignored | No predicate for that key in the collection config. |
| Numbers changed after reload | Something introduced `Math.random()` into the seed. The seed must be deterministic. |

Set `quiet: false` in `enableMocking()` to see every intercepted request.

## Never

- Persist mock state to `localStorage` — in-memory is the documented behaviour.
- Skip `authorize` because "the UI already hides it".
- Randomise the seed.
