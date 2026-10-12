---
name: mocking
description: How the mock API is built — the in-memory collection, the deterministic seed, the resource handler factory, permission enforcement, latency, and the rules for adding an endpoint. Use whenever adding or changing anything under src/app/mocks.
globs:
  - "src/app/mocks/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# The mock API

MSW intercepts every request the panel makes. There is no other backend.

## Why it lives in `app/`

`src/app/mocks/` imports entity schemas, which only the top FSD layer may do. The mock **is**
app initialisation — started in the composition root before the first render — so it belongs
there rather than in `shared/`, where the import would invert the layer order. This is the one
documented exception in `fsd.md`.

## Layout

```
src/app/mocks/
  collection.ts     generic in-memory table: search, filter, sort, paginate
  seed.ts           deterministic domain dataset
  seedAccess.ts     roles and users
  db.ts             the collections, the session map, recordAudit
  handlers/
    lib.ts                    auth, permission checks, query parsing, latency
    createResourceHandlers.ts the CRUD factory
    auth.ts  analytics.ts     hand-written handlers
    index.ts                  every resource wired up
  browser.ts        setupWorker
  index.ts          enableMocking()
```

## The seed is deterministic

`createSeedData()` uses a seeded PRNG (`mulberry32`) keyed by a hash of the facility and
product ids. The dataset is **identical on every reload** — a screenshot, a test and a demo all
see the same numbers. Never introduce `Math.random()` into the seed.

Ids are readable slugs (`de`, `nmc-811`, `salzgitter-cathode-lab`), not uuids, because they end
up in the URL through nuqs and `?countryId=de&productId=nmc-811` should stay shareable.

## Adding a resource

Use `createResourceHandlers`. A new resource is a config object — never another 120 lines of
near-identical handlers:

```ts
...createResourceHandlers({
  resource: 'countries',
  collection: db.countries,
  auditEntityType: 'country',
  readPermission: 'countries:read',
  writePermission: 'countries:write',
  createSchema: countryCreateSchema,
  updateSchema: countryUpdateSchema,
  label: country => country.name,
  guardDelete: country => (hasChildren(country) ? 'Remove … first' : null),
})
```

The factory gives you: list with the full query envelope, get by id, create, update, delete —
each permission-checked, validated against the schema, and audited.

## Rules for a hand-written handler

Only write one when the shape genuinely is not CRUD (auth, analytics). It must still:

1. `await latency()` — the UI's loading states need to be exercised.
2. `authorize(request, permission)` and return `auth.response` when it refuses.
3. Validate the body with a schema before touching the db.
4. Call `recordAudit` if it mutates anything.

## Referential integrity

`guardDelete` returns a message to refuse a delete that would orphan rows — a country with
facilities, a product with production records. The API returns `409` and the UI surfaces the
message. Do not let the mock produce a dataset a real database would reject.

## What the mock does not do

No persistence across reloads (state is in memory by design), no real password hashing, no
rate limiting. `DEPLOYMENT.md` says so plainly, so nobody mistakes this for a backend.
