# Shared vocabulary — supply-chain-admin-panel

Each word below means exactly one thing in this repository. They are used in `CLAUDE.md`,
`.claude/rules/`, `.claude/agents/`, commit messages and PR descriptions. Using a synonym is
not a style slip: it makes a grep miss and sends an agent to the wrong document.

Adapted from the `CONTEXT.md` convention in
[mattpocock/skills](https://github.com/mattpocock/skills).

## Architecture

**Layer** — one of the six FSD tiers: `app`, `pages`, `widgets`, `features`, `entities`,
`shared`. Imports flow downward only. *Avoid*: level, tier.

**Slice** — one directory under a layer: `entities/country/`, `widgets/world-map/`. Has an
`index.ts` barrel that is the only legal cross-slice import target. *Avoid*: module, folder,
component group.

**Segment** — a directory inside a slice: `ui/`, `model/`, `api/`, `lib/`, `config/`. Create
only the ones the slice needs. *Avoid*: section, part.

**Barrel** — a slice's `index.ts`. It exports the slice's public surface and nothing else.

**Route** — a file under `src/routes/`. A thin adapter: it declares the path, the guard and
the document title, then renders a **Page**. It holds no markup of its own beyond that.

**Page** — a slice under `src/pages/`. Composes widgets and features for one route. Holds no
business logic. *Avoid*: view, screen (except informally in conversation).

**Widget** — a self-contained section reused across pages that **knows the domain**: the world
map, the app shell, the production summary, the entity CRUD screen. A section that knows
nothing about the domain is a `shared/ui` primitive, not a widget — that is why `DataTable`
lives there. *Avoid*: block, section component.

**Entity** — a domain object and everything that reads or writes it: `country`, `product`,
`facility`, `production-record`, `user`, `role`, `audit-entry`, `session`, `access`.

## Data

**Service** — a functional object built by a `create*Service(http)` factory under
`entities/*/api/`. Takes its transport as a parameter. Never a class. *Avoid*: repository,
client, API class.

**Queries** — the React Query bindings for a service, built by `createCrudQueries`. Owns the
cache keys and the `queryOptions`/mutation option objects. *Avoid*: hooks file.

**Resource** — the API path segment a service addresses: `countries`, `production-records`.
The same string is the root of that entity's query keys.

**Record** — specifically a `ProductionRecord`: one facility's output of one product in one
year. Not a generic word for a row.

**Point** — one dot on the world map: a country's aggregated output under the active filters.

**Mock** — an MSW handler under `src/app/mocks/`. The mock API is the only backend this
project has; it enforces permissions for real.

**Seed** — the deterministic dataset built at boot by `createSeedData()`. Identical on every
reload; never randomised per session.

## Access

**Permission** — a `<resource>:<action>` string from the `Permission` union, e.g.
`production:write`. Exhaustively listed in `PERMISSIONS`.

**Role** — a named set of permissions. `ADMIN` is the one role that always holds everything.

**Subject** — the `{ roleName, permissions }` shape `hasPermission` takes. Derived from the
session user by `toPermissionSubject`.

**Gate** — the pair of checks that protect a capability: `hasPermission` in the UI *and* the
`authorize()` call in the mock handler. A gate is only a gate when both halves exist.

**Audit entry** — one recorded operator action. Read-only everywhere; nothing in the panel
writes one directly, only `recordAudit` inside a handler does.

## Process

**Gate** (mechanical) — `pnpm lint`, `pnpm check`, `pnpm typecheck`, `pnpm test`. "Green"
means all four exited zero. *Avoid*: the checks, CI stuff.

**Rule** — a file under `.claude/rules/`. **Project law**, listed exhaustively in `CLAUDE.md`'s
Rule Index, read because its `globs:` match the files being touched. *Avoid*: guideline,
convention doc.

**Skill** — a directory under `.claude/skills/` holding a `SKILL.md`. A **recipe** for one
technology or workflow, loaded because you are working in that technology. Rules say what this
project requires; skills say how the technology works. *Avoid*: guide, playbook.

**Command** — a file under `.claude/commands/`, invoked as `/sc-<name>`.

**Agent** — a file under `.claude/agents/`, dispatched via the Agent tool. Pins its own model
and effort.

**Token** — a CSS custom property in `src/app/styles/`. Never a hard-coded colour or size.
*Avoid*: variable, css var (when a design token is meant).
