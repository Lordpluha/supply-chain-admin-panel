---
name: testing
description: Vitest conventions — the .unit-spec/.int-spec split, what each layer owes a test, how to test a service through its injected HttpClient without a mocking framework, rendering with providers, and the accessibility assertions every UI test carries. Use whenever writing, running or reviewing a test.
globs:
  - "**/*.unit-spec.*"
  - "**/*.int-spec.*"
  - "**/*.snapshot-spec.*"
  - "**/*.screenshot-spec.*"
  - "**/*.e2e-spec.*"
  - "src/shared/config/vitest.setup.ts"
  - "tests/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Testing

Vitest + Testing Library, jsdom. Suffixes follow bitrate's `packages/ui-react` convention.

Five layers, five suffixes, and each is a separate runner project so one can be
run — and re-run — without the others.

| Suffix | Project | Scope |
|---|---|---|
| `*.unit-spec.ts(x)` | `unit` | One module in isolation: a pure function, a schema, a store, a single component's own rendering. |
| `*.int-spec.tsx` | `integration` | Several units composed: a form that submits, a table that sorts, a route that throws and lands on its error screen. |
| `*.snapshot-spec.tsx` | `snapshot` | Markup, pinned. Catches the class that quietly disappears in a refactor. |
| `*.screenshot-spec.tsx` | `screenshot` | Rendered pixels, in a real browser. |
| `*.e2e-spec.ts` | Playwright | A flow across page boundaries — what an operator can do, not what a component renders. |

```bash
pnpm test              # unit + integration + snapshot + screenshot
pnpm test:unit         # unit only
pnpm test:int          # integration only
pnpm test:snapshot     # markup snapshots only
pnpm test:snapshot -u  # update markup snapshots
pnpm test:screenshot:update # update browser baselines
pnpm test:screenshot   # the browser project
pnpm test:e2e          # Playwright
pnpm test:all          # everything vitest knows about
```

Specs sit **next to** the file they cover, inside the slice. No separate
`__tests__/` tree. The exception is `tests/`, which holds the Playwright config,
its support helpers, and the MSW server the integration project runs on — that
is infrastructure, not a slice, and it sits outside `src/` so the layer rules do
not have to make an exception for it.

## The UI kit is one folder per component

```
src/shared/ui/button/
  button.tsx
  button.unit-spec.tsx
  button.int-spec.tsx
  button.snapshot-spec.tsx
  button.screenshot-spec.tsx
  button.stories.tsx
  index.ts            ← export * from './button'
```

A new component gets the whole set. The barrel is what keeps
`@/shared/ui/button` resolving, so no import changes when a component grows from
a file into a folder.

## Integration specs talk to the real mock API

The `integration` project starts MSW in Node from the same handlers the browser
worker registers (`tests/setup/msw-server.ts`), and an unhandled request is an
error rather than a passthrough. A feature spec therefore exercises the API it
actually ships against — including the permission checks, which means a spec
that needs data **signs in first**, exactly as the panel does:

```ts
beforeEach(async () => {
  await authService.login(DEFAULT_CREDENTIALS)
})
```

MSW keeps the cookie it issued and replays it, so every request after that is
authenticated.

## What each layer owes

| Layer | Test |
|---|---|
| `shared/lib`, `shared/api` | unit — the factories, the query serialiser, the formatters |
| `entities/*/model` | unit — schema accepts valid input and rejects each invalid case |
| `entities/*/api` | unit — the service calls the right path with the right body, via a stub `HttpClient` |
| `entities/access` | unit — `hasPermission` including the `ADMIN` short-circuit |
| `shared/ui` | unit + int + snapshot + screenshot — one folder per component |
| `widgets`, `features` | int — the interaction actually works, against the mock API |
| every CRUD entity | e2e — create, read, update, delete, through the screen |
| `app/mocks` | unit — the collection's query engine; the handlers' permission refusals |

## Services need no mocking framework

Dependency inversion is what makes this cheap. Pass a function:

```ts
const calls: Array<{ url: string; options?: unknown }> = []
const http: HttpClient = async (url, options) => {
  calls.push({ url, options })
  return { items: [], total: 0, page: 1, pageSize: 25 } as never
}

const service = createCountryService(http)
await service.list({ search: 'de' })

expect(calls[0].url).toBe('/countries')
```

Never `vi.mock('ofetch')`. If a test wants to mock a module, the seam is in the wrong place.

## Query by role, not by class

```tsx
// ❌
container.querySelector('.submit-button')

// ✅
screen.getByRole('button', { name: /save/i })
```

`getByRole` failing is usually the component telling you it is not accessible. Fix the
component, do not reach for a test id. `getByTestId` is a last resort and carries a comment.

## Every UI test asserts accessibility

At minimum: the control has an accessible name, and an error is tied to its field. A component
that cannot be queried by role does not pass review.

## Rendering with providers

Use the `renderWithProviders` helper (`src/shared/lib/test-utils.tsx`) — it wraps the tree in a
fresh `QueryClient` (retries off), the i18n provider pinned to English, and the nuqs adapter.
A test never shares a `QueryClient` with another test.

## React updates and teardown

Await user interactions. Wrap direct focus, store updates and language changes in
`act` when they notify mounted React components. For asynchronous mount effects,
await `act(async () => render(...))`; for lazy imports, await
`vi.dynamicImportSettled()` inside `act` before asserting or taking a screenshot.
Browser components that schedule frame updates must finish those frames inside
`act` as well.

Call `cleanup()` before resetting shared stores or i18n. Await pending URL changes
before ending a nuqs test so its queue cannot outlive the test environment.
Do not silence React warnings globally.

Screenshot baselines live directly in each component's `__screenshots__/`
directory, without browser or viewport subdirectories.

## Determinism

The seed is deterministic, so assert real numbers rather than `expect.any(Number)`. Freeze time
with `vi.setSystemTime` when a test touches `createdAt` or the audit trail.

## Watch out for

- **`createTestQueryClient()` sets `gcTime: 0`**, so a cache entry with no
  observer is collected immediately. A spec asserting on something seeded with
  `setQueryData` needs its own client, or something in the tree observing it.
- **A required field's label carries an `aria-hidden` asterisk.** It stays in
  the label's *text* though not in the accessible name, so `getByLabelText`
  needs a prefix match where `getByRole(..., { name })` does not.
- **Base UI often renders a control that jsdom cannot see.** A slider's handle
  is a visually hidden `<input type="range">`; a checkbox is a `<button
  role="checkbox">` with `data-disabled` rather than the `disabled` property.
  Assert on what the component actually renders, and say why in a comment.
- **jsdom does not implement `scrollIntoView` or `scrollTo`.** Both are stubbed
  in `vitest.setup.ts`; without that, a call from a `requestAnimationFrame`
  fails the run *after* the test that scheduled it has passed.

## Running

```bash
pnpm test              # unit + integration + snapshot + screenshot
pnpm test:watch        # while working
pnpm test -- <path>    # one file
```
