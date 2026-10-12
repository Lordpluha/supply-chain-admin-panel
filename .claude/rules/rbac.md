---
name: rbac
description: The access-control contract — the Permission union, the exhaustive catalogue, hasPermission as a cosmetic check, the mandatory server-side authorize() half, route guards, and how the audit trail records every mutation. Use whenever adding a gated screen, a permission, a role, or any mutating endpoint.
globs:
  - "src/entities/access/**"
  - "src/entities/role/**"
  - "src/entities/audit-entry/**"
  - "src/app/mocks/handlers/**"
  - "src/routes/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Roles, permissions and the audit trail

Modelled on `apps/admin`'s access layer in bitrate.

## The session credential

Never in `localStorage`, never in application state, never in a variable. It lives in a cookie
the API issues and the browser replays; `httpClient` sends `credentials: 'same-origin'` and
that is the whole of the client's involvement. "Am I signed in" is answered by
`GET /auth/session`, not by inspecting a token.

`HttpOnly` is absent because a browser only honours it on a cookie from a real network
response, and this prototype has no server — [`SECURITY.md`](../../SECURITY.md) sets out the
reasoning and what a real deployment changes. Do not add the attribute to the cookie string to
make it look right: the browser drops it and the code then claims a protection it lacks.

## A permission is `<resource>:<action>`

Declared once as a union in `entities/access/model/permission.ts` and mirrored into
`PERMISSIONS` through `coveringTuple`, which makes a missing member a **compile error** rather
than a silently absent checkbox on the roles screen.

Adding a permission means touching four places in one commit:

1. The `Permission` union.
2. The `PERMISSIONS` tuple.
3. `PERMISSION_GROUPS`, so it renders on the roles screen.
4. `roles.resources.*` in all four locales.

## Two checks, always

| Half | Where | What it does |
|---|---|---|
| Cosmetic | `hasPermission({ subject, permission })` in the UI | Decides what renders. |
| Real | `authorize(request, permission)` in the MSW handler | Refuses the request with 403. |

**A gate with only the UI half is not a gate.** Hiding a button does not stop a request; the
mock API is written to refuse it, exactly as a real backend would. This is why the prototype's
RBAC story is honest rather than decorative.

```ts
// handler
const auth = authorize(request, 'production:write')
if ('response' in auth) return auth.response
```

## `ADMIN` short-circuits

`hasPermission` returns `true` for any subject whose `roleName` is `ADMIN`. That is safe
because role names are unique and the built-in `ADMIN` already holds the name — a custom role
cannot take it. It also means `ADMIN` automatically holds permissions that do not exist yet.

## Route guards

A gated route declares its permission in `beforeLoad` and redirects rather than rendering an
empty screen:

- Not signed in → redirect to `/login` carrying the attempted path.
- Signed in but lacking the permission → the `noAccess` screen, not a 404, so the operator
  knows to ask for access rather than thinking the page is gone.

Navigation is filtered by the same permissions, so the sidebar never offers a dead end.

## Protected permissions

`PROTECTED_PERMISSIONS` covers `users:*` and `roles:*` — the ones that hand out access. The
roles screen must not let a role remove its own ability to grant permissions.

## The audit trail

Every mutation that passes `authorize` calls `recordAudit`. That is wired once inside
`createResourceHandlers`, so a resource added through the factory is audited automatically —
a hand-rolled handler must call it explicitly.

The trail is **read-only**: `AuditEntryService` implements only `ReadableService`, and no
create/update/delete endpoint exists for it. An audit trail somebody can edit is not an audit
trail.

Reading it requires `audit:read`, which only `ADMIN` and `AUDITOR` hold.

The IP column is gated separately by `audit-ip:read`, and gated **twice**: the handler masks
the field for a caller without it, and the page drops the column. When a single field is more
sensitive than the record around it, mask it on the server — hiding the column alone leaves the
value in the response.

`audit-ip:read` is also the pattern for a permission that is not a plain `read`/`write` pair:
it gets its own row in `PERMISSION_GROUPS` (`resource: 'auditIp'`) rather than a third column
in the grid, so `PermissionGrid` stays a two-column table.
