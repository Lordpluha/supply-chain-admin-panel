---
name: oxlint-biome
description: How the two-tool quality setup works here — oxlint as the only linter, Biome as the formatter with its linter deliberately off, what each config controls, how to read and fix their output, and the auto-fix commands. Use whenever pnpm lint or pnpm check fails, or when adding a rule.
metadata:
  version: "1.0.0"
  type: reference
  author: lordpluha
license: SEE LICENSE IN LICENSE
---

# oxlint + Biome

Two tools, zero overlap. Biome is also a linter — that half is switched **off** on purpose, so
one problem is never reported twice under two rule names.

| Tool | Job | Config |
|---|---|---|
| oxlint | Correctness. The only linter. | `.oxlintrc.json` |
| Biome | Formatting + import order. Formatter only. | `biome.json` |

## Commands

```bash
pnpm lint        # oxlint
pnpm lint:fix    # oxlint --fix
pnpm check       # biome check .
pnpm check:fix   # biome check --write .
pnpm format      # biome format --write .
```

A `PostToolUse` hook runs `biome format --write` after every edit, so `pnpm check` rarely fails
in practice. When it does, it is usually import order — `check:fix` handles it.

## oxlint configuration

Plugins on: `react`, `typescript`, `import`, `jsx-a11y`, `oxc`, `promise`, `unicorn`.

`react-perf` was tried and removed: its `jsx-no-new-object-as-prop` family fires on every
inline prop, including throughout the vendored shadcn components, and the advice it gives is
wrong for React 19 more often than it is right.

Categories: `correctness` and `suspicious` are **errors**; `pedantic` and `style` are off —
Biome owns style, and pedantic is noise at this size.

Explicit rules worth knowing:

| Rule | Why |
|---|---|
| `typescript/no-explicit-any` | error — see `typescript.md` |
| `typescript/consistent-type-imports` | `verbatimModuleSyntax` makes this load-bearing |
| `import/no-cycle` | a cycle is almost always a sibling import that should go one layer down |
| `react/no-array-index-key` | index keys break list reconciliation on reorder |
| `no-console` | error, except in `src/app/mocks/**` and config files |
| `unicorn/no-array-sort` | `sort()` mutates; `toSorted()` does not. `lib` is `ES2023` so both exist. |
| `react/react-in-jsx-scope` | off — `jsx: react-jsx` is the automatic runtime, `React` is never in scope |
| `import/no-named-as-default-member` | off — i18next's default export really does carry `use`/`createInstance` |

## Adding a rule

Add it to `.oxlintrc.json`, run `pnpm lint`, fix the fallout in the same commit. A rule
introduced with pre-existing violations left behind trains everyone to ignore the output.

If a rule needs to be off for one directory, use `overrides`, not a blanket disable. Two exist:
`src/shared/ui/**` switches off two `jsx-a11y` rules the vendored primitives cannot satisfy
(the control they label is supplied by the caller), and the test setup file is exempt from
`import/no-unassigned-import` because a side-effect import is exactly what it needs.

## Biome configuration

Single quotes, no semicolons, trailing commas, 100 columns, 2-space indent, arrow parens
omitted for one argument. `assist.source.organizeImports` is on — Biome, not oxlint, decides
import order.

Ignored: `src/routeTree.gen.ts`, `public/mockServiceWorker.js`, `pnpm-lock.yaml`,
`.claude/skills/**`.

The CSS parser needs `css.parser.tailwindDirectives: true`, or Biome rejects `@theme`,
`@utility`, `@custom-variant` and `@apply` as parse errors.

## Never

- Turn Biome's linter on.
- Add ESLint or Prettier back. They were removed deliberately.
- Edit a generated file to silence a gate.
- Commit an `oxlint-disable` without a comment naming the upstream reason.

## `--threads=4`, and why

oxlint defaults to one worker per core. On a 20-core machine with a couple of gigabytes free —
say, right after `tsc` or `vitest` — it is killed mid-run, prints

```
[warn] Linter process terminated abnormally (possibly out of memory)
```

and **still exits zero**, so the gate reports green having linted nothing.

Capping the threads removes the condition. If that line ever appears anyway, the run did not
happen: re-run `pnpm lint` on its own rather than trusting the exit code. `pnpm verify` chains
the gates sequentially for the same reason — never run `typecheck` and `lint` concurrently.
