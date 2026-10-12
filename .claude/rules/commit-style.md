---
name: commit-style
description: Conventional Commits as enforced by commitlint, the commitizen prompt, the type and scope vocabulary for this repo, and the lefthook stages that run at commit and push time. Use whenever writing a commit message or a PR title.
globs:
  - "**/*"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Commit style

**Conventional Commits**, enforced mechanically by `commitlint` at the `commit-msg` stage. A
message that does not parse is rejected before it lands.

```
<type>(<scope>): <subject>

[body]

[footer]
```

## Writing one

```bash
pnpm commit        # commitizen — prompts through type, scope, subject
git commit         # also fine; commitlint still checks it
```

Use `pnpm commit` when unsure of the vocabulary; it only offers what commitlint accepts.

## Types

| Type | For |
|---|---|
| `feat` | A capability the operator can see |
| `fix` | A defect repaired |
| `refactor` | Behaviour unchanged, structure improved |
| `perf` | A measured performance improvement |
| `style` | Formatting only — no logic |
| `test` | Tests added or corrected |
| `docs` | Documentation, `.claude/`, README |
| `build` | Build tooling, dependencies, Docker |
| `ci` | Pipelines and hooks |
| `chore` | Housekeeping that fits nothing above |
| `revert` | Reverts a previous commit |

## Scopes

The FSD slice or the concern touched: `dashboard`, `map`, `countries`, `products`,
`facilities`, `production`, `users`, `roles`, `audit`, `auth`, `i18n`, `theme`, `ui`, `api`,
`mocks`, `docker`, `claude`.

```
feat(map): filter the summary when a country dot is selected
fix(auth): clear the session when the API returns 401
docs(claude): add the rbac rule
build(docker): serve the SPA from nginx with history fallback
```

## Subject

Imperative mood, lower case, no trailing period, ≤72 characters. Say what changed, not that
something changed.

```
❌ fix: fixed some bugs in the table
✅ fix(ui): keep the sort direction when the page changes
```

## Body

Explain **why**, and what a reader would otherwise have to reverse-engineer. Wrap at 100.

## Breaking changes

`!` after the scope and a `BREAKING CHANGE:` footer naming the migration.

## Hook stages

| Stage | Runs |
|---|---|
| `pre-commit` | `biome check --staged --write`, then `oxlint` on staged files |
| `commit-msg` | `commitlint` |
| `pre-push` | `pnpm typecheck && pnpm test` |

Do not `--no-verify`. If a hook is wrong, fix the hook.
