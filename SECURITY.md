# SECURITY.md

What this prototype does about security, what it deliberately does not, and — for the one
control that could not be implemented — exactly why.

## The session cookie, and the missing `HttpOnly`

### What was asked for

A session credential in an `HttpOnly`, fully-secured cookie.

### What was delivered

A session cookie carrying every attribute a browser will actually enforce here:

```
supply_chain_session=<token>; Path=/; SameSite=Strict; Max-Age=28800; Secure
```

| Attribute | Status | Why |
|---|---|---|
| `Path=/` | ✅ enforced | Scopes the cookie to this application. |
| `SameSite=Strict` | ✅ enforced | This panel is never linked to from anywhere else, so no cross-site navigation legitimately needs the session. Strict, not Lax. |
| `Max-Age=28800` | ✅ enforced | Eight hours — one working shift, then re-authenticate. |
| `Secure` | ✅ enforced, conditionally | Set on every origin except plain-http `localhost`, where a browser rejects the cookie outright and nobody could sign in. |
| `HttpOnly` | ❌ **not achievable** | See below. |

### Why `HttpOnly` could not be implemented

`HttpOnly` is not a flag an application opts into. It is a promise the **browser** makes, and
the browser only makes it for a cookie that arrived in a `Set-Cookie` header on a **real
network response**. A cookie created by client-side JavaScript — through `document.cookie` or
anything built on it — cannot be `HttpOnly`, by construction: the browser silently drops the
attribute, because the script setting it could trivially read it back.

This prototype has **no backend**. Every request is answered by Mock Service Worker, which runs
inside the browser as a service worker. MSW can return a `Set-Cookie` header, and its own
documentation is explicit about what happens next:

> Setting the `Set-Cookie` header on the mocked response will set the cookies **on the
> `document`** as if they were received from the server.

"On the `document`" is the whole point: the cookie lands in `document.cookie`, which is
JavaScript-readable. MSW faithfully reproduces the *shape* of a server-issued session — the API
hands out the cookie, the browser replays it on subsequent requests, the API reads it back —
but it cannot produce the *guarantee*, because there is no server and no network response for
the browser to trust.

Writing `HttpOnly` into the attribute string anyway would have been worse than leaving it out:
the code would claim a protection that does not exist, and a reader auditing it would have to
discover the truth themselves.

### What was done instead

The credential was removed from JavaScript's reach as far as it can be without a server:

1. **Nothing is stored in `localStorage`.** An earlier revision persisted a bearer token there
   through `zustand/persist`. That is strictly worse than a cookie: `localStorage` is readable
   by any script on the origin, never expires on its own, and is trivially exfiltrated by an
   XSS payload. It is gone.
2. **No token is held in application state.** There is no `token` field anywhere in the client.
   `httpClient` sends `credentials: 'same-origin'` and the browser attaches the cookie itself.
3. **"Am I signed in" is a question for the API.** `GET /api/auth/session` reads the cookie and
   answers; the client never inspects a credential to find out.
4. **Logout clears server-side too.** The token is deleted from the session map *and* the
   cookie is expired, so a replayed cookie is refused rather than merely absent.

The practical gap that remains: an XSS payload on this origin could read the cookie out of
`document.cookie`. With a real server issuing an `HttpOnly` cookie, it could not — though it
could still *use* the session by making requests, which is why `HttpOnly` is a mitigation and
not a cure.

### What a real deployment must do

Terminate `/api/auth/*` on a server, and have that server set:

```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800
```

Nothing in the client needs to change: it already never touches the credential. The cookie
simply becomes unreadable to script as well as unused by it.

## Access control

Permissions are checked **twice**, and this is not decorative:

| Where | What it does |
|---|---|
| `hasPermission()` in the UI | Decides what renders. Hides a button, filters the navigation. |
| `authorize()` in the mock API | **Refuses the request** with `403`. |

Hiding a button does not stop a request, so the mock API re-checks every call against the
signed-in role exactly as a real backend would. A capability with only the UI half is not
gated — see `.claude/rules/rbac.md`.

`ADMIN` short-circuits to "allowed". That is safe because role names are unique and the
built-in `ADMIN` already holds the name, so a custom role cannot take it.

## The audit trail

Every mutation that passes authorisation is recorded: who, what, which record, when. The trail
is **read-only by construction** — `AuditEntryService` implements only the readable half of the
service interface, and no create/update/delete endpoint exists for it. An audit trail somebody
can edit is not an audit trail.

Reading it requires `audit:read`, held by `ADMIN` and `AUDITOR` only.

The **IP address column is behind its own permission**, `audit-ip:read`. An address says where
a person was sitting, which is a stricter disclosure than the fact that they changed a row, and
the two should not travel together by default. The split is enforced **server-side**: the
handler in `app/mocks/handlers/index.ts` replaces `ipAddress` with `null` for a caller without
the permission, so the field is absent from the response rather than merely absent from the
table — a column the client declines to render is still in the network tab. The page then omits
the column entirely, because a row of dashes advertises nothing useful.

`AUDITOR` deliberately does **not** hold `audit-ip:read`. That is not a claim about what a real
auditor should see; it is so the narrower permission is visible in the running prototype rather
than only in the roles grid.

## Passwords

Compared in **plain text**, in the browser, against a seeded map. This is a mock: there is no
password storage to protect and no server to hash on. A real deployment hashes with Argon2id or
bcrypt server-side and never ships a password list to a client at all.

The login form is pre-filled with the seeded operator's credentials on purpose — the point of
the prototype is the supply map, not a login ceremony.

Login failures return one message for both "no such account" and "wrong password", so the form
cannot be used to enumerate who has access.

## Secrets

There are none, and that is a deliberate property to preserve.

- `.env` is git-ignored; `.env.example` and `.env.test` are committed and carry placeholders.
- Only `VITE_`-prefixed variables reach the bundle, and Vite **inlines them at build time** —
  anything put there is public. It is not a place for a credential.
- A `PreToolUse` hook refuses agent reads and writes of `.env` and `.env.*.local`.

If this ever needs a real credential, it belongs on a server, not in this bundle.

## Dependencies

- `legacy-peer-deps` was removed from `.npmrc`. It silences peer-dependency conflicts, which on
  a React 19 codebase is exactly the signal worth seeing.
- Versions are pinned rather than floating on `latest`, so a build is reproducible and a
  dependency cannot change under the project unobserved.
- Node is pinned to `24.21.0` in `.nvmrc`, `engines`, and `packageManager`.

## Known limitations, stated plainly

| Limitation | Consequence |
|---|---|
| No backend | `HttpOnly` unavailable; see above. |
| In-memory data | Everything resets on reload. Not a defect — the documented behaviour. |
| Plain-text passwords | Mock only. Never ship this login to production. |
| No rate limiting | Nothing to rate-limit; there is no server. |
| No CSRF token | `SameSite=Strict` covers the cross-site case here. A real deployment with any cross-origin surface needs one. |
| Mock FX rates and prices | Every converted figure is labelled indicative in the UI. |

## Reporting

This is a take-home prototype, not a deployed service. Security questions go to the owner named
in [`LICENSE`](LICENSE).
