---
name: errors
description: Where a failure is shown — global failures as a sonner toast, per-field validation beside the input it belongs to, with scroll and focus onto the first invalid control. Covers the ApiError → placement → message pipeline, the meta.silenceErrorToast escape hatch, and what each surface owes a reader. Use whenever handling, rendering or reviewing an error path.
globs:
  - "src/**/*.tsx"
  - "src/shared/lib/errors.ts"
  - "src/app/providers/queryClient.ts"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Errors

Two placements, and the choice is never a judgement call — it follows from the failure.

| Failure | Placement | Why |
|---|---|---|
| `400` carrying a `fields` map | **Beside the field** | The reader has to know *which* input. A toast names no field and leaves on a timer. |
| `401`, `403`, `404`, `409`, `5xx`, network | **Toast** (sonner) | The surface that failed may not be on screen by the time the answer arrives. |
| A list query failing | **In the surface that owns it** | `DataTable` already renders it in the empty state. A toast would say it twice. |
| A route throwing, or matching nothing | **A whole screen** | There is no surface left to put a message beside, and a toast over a blank page explains nothing. |

`placementOf(error)` in `shared/lib/errors.ts` makes the decision; nothing re-derives it.

## Whole-screen — the error pages

Four screens, all built from `shared/ui/error-page.tsx` so they are one family
rather than four people's idea of a sad face:

| Screen | Where it is wired | When |
|---|---|---|
| `NotFoundPage` | `notFoundComponent` on `__root` **and** `_authed` | No route matched |
| `AppErrorPage` | `errorComponent` on `__root` **and** `_authed` | A route's loader or render threw |
| `NoAccessPage` | the `/no-access` route | Signed in, page exists, permission missing |
| `StartupErrorPage` | `AppProviders`, when `bootstrap()` rejects | i18n or the mock worker failed |

**Wired twice on purpose.** Inside `_authed` the screen renders within `AppShell`,
so the sidebar and header survive and the operator has somewhere to go next.
At the root — reached when the shell itself did not survive, or the path was
never inside the panel — it stands alone.

Three rules for any screen added here:

1. **Always a way out.** A dead end is not an error page. At minimum a link home.
2. **Something quotable.** The path that missed, the permission, the server's
   own sentence. "It's broken" is not a report; `/facilities/salzgitter` is.
3. **The thrown message only in development**, behind a literal
   `import.meta.env.DEV` so Vite drops the branch. A stack trace on a
   production screen helps nobody who can act on it.

`AppErrorPage` reads an `ApiError` through `errorMessageKey`, the same mapping
the toasts use — a loader that 404'd says "that record no longer exists" rather
than the generic crash copy.

## Global — sonner

Wired once, in the `MutationCache`'s `onError`. **No component calls `toast.error` for an API
failure.** If you find yourself writing one, the mutation is missing its wiring.

```ts
onError: (error, _variables, _context, mutation) => {
  if (mutation.meta?.silenceErrorToast) return
  reportMutationError(error)
}
```

The message is `t(errorMessageKey(error))`. For a `403` or a `409` the server wrote a sentence
for a human — "Remove the facilities in this country first" — and that sentence goes in the
toast's `description`, because it is more useful than the generic line.

`meta.silenceErrorToast: true` is for a surface that renders the failure itself. Use it rather
than letting the reader be told the same thing twice, in two places, one of which vanishes.

## Local — beside the control

Three things, always together:

1. **`aria-invalid` on the control**, so it is announced as invalid and can be found.
2. **The message as a sibling**, tied with `aria-describedby`. Never a `title`, never a
   placeholder.
3. **A non-colour signal** — the border changes *and* an icon appears *and* the reason is
   written out. Colour alone fails `a11y.md`.

`shared/ui/field.tsx` does all three; use it rather than hand-rolling the wiring.

```tsx
<Field label={t('countries.name')} error={errors.name?.message} required>
  {props => <Input {...props} {...register('name')} />}
</Field>
```

## Server field errors

`useServerFieldErrors` replays the server's `fields` map onto react-hook-form, then scrolls the
first invalid control into view and focuses it.

It returns `true` when it handled the error — which is the signal not to fall through to a
toast:

```ts
onError: error => {
  if (applyServerErrors(error)) return
  // anything else is global and the MutationCache already reported it
}
```

Scroll before focus, and honour `prefers-reduced-motion`: focusing alone jumps instantly and
loses the reader's place on a long form.

## Schema messages are translated

The rule lives in the Zod schema; what renders is a `t()` lookup. Never ship an untranslated
sentence from a schema to a French operator.

## What never happens

- A validation failure as a toast.
- A `toast.error` written inside a component for an API failure.
- An error swallowed by a `try/catch` that logs nothing and shows nothing.
- Colour as the only indication that a field is wrong.
- A message assembled by parsing a response body at the call site — read the status through
  `errorMessageKey`.
