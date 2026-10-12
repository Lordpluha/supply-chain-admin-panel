# `.claude/` — supply-chain-admin-panel agent layer

One layer on top of [`CLAUDE.md`](../CLAUDE.md), which is the compact routing entrypoint and
holds the shared non-negotiables. Everything here is **project-scoped**: nothing in this repo
writes to `~/.claude/`.

## Folder layout

| Path | Purpose |
|---|---|
| `CONTEXT.md` | The vocabulary. One word, one meaning — a synonym makes a grep miss. |
| `rules/` | Project law, one file per concern. Each carries `globs:`; read the ones that match the files you are touching. `CLAUDE.md`'s Rule Index mirrors them. |
| `skills/` | Technology recipes. Rules say what this project requires; skills say how the technology works. |
| `agents/` | Eight specialists, dispatched via the Agent tool. |
| `commands/` | Entry points, invoked as `/sc-<name>`. |
| `templates/` | Canonical slice trees, consumed through the `fsd` skill. |
| `hooks/` | Mechanically enforced policy, wired in `settings.json`. |
| `settings.json` | Permissions, hooks, enabled plugins. Committed. |

## Agents

| Agent | Model | Effort | Role |
|---|---|---|---|
| `sc-manager` | Opus | high | Coordinator: grills a vague task, plans it, and keeps `CLAUDE.md`, `.claude/` and the root docs true. Merges bitrate's planner, manager and librarian. Read-only. |
| `sc-designer` | Opus | high | Visual and interaction design: `DESIGN.md`, the three-theme token set, the type scale, the map's visual language, the a11y contract. |
| `sc-frontend-developer` | Sonnet | medium | Everything under `src/`. Reuse-first, rule-bound. Auto-invokes `sc-reviewer` on substantial diffs. |
| `sc-tester` | Opus | high | Focused Vitest specs, unit and integration. |
| `sc-debugger` | Opus | high | Reproduce → isolate → fix the cause → verify. |
| `sc-devops` | Opus | high | Docker, nginx, lefthook, commitlint, env, Storybook, build config, deployment docs. |
| `sc-reviewer` | Opus | high | Mechanical pass + checklist walk + goal check. Structured verdict with `file:line`. |
| `sc-worker` | Opus | high | Orchestrator. Owns a task 0→100%, delegates each stage, re-verifies every claim. |

Model and effort are fixed per agent in its own frontmatter, not chosen per invocation.
Implementation runs on Sonnet at medium; everything where a missed edge case is expensive —
design, tests, debugging, review, infrastructure, orchestration — runs on Opus at high.

## Commands

| Command | What it does |
|---|---|
| `/sc-implement "<task>"` | Implement a change end to end, then run the gates. Dispatches `sc-frontend-developer` by default. |
| `/sc-review` | Walk the architecture checklist over the current diff via `sc-reviewer`. |

## Vague or large tasks — `grill-me`

`/grill-me` (from the `mattpocock-skills` plugin, enabled for this project in
`settings.json`) sharpens a task by interview before it is planned. `sc-manager` and
`sc-worker` both apply its method themselves when a task arrives underspecified: the decision
tree is worked in **rounds**, the whole settled frontier is asked at once, each question
numbered and carrying a recommended answer.

Install once per machine if it is missing:

```bash
claude plugin install mattpocock-skills
```

## Hooks

| Hook | Stage | What it does |
|---|---|---|
| `block-env-access.sh` | PreToolUse | Refuses Read/Edit/Write on `.env` and `.env.*`, allowing `.env.example`. |
| `format-on-edit.sh` | PostToolUse | Runs `biome format --write` on the file just edited. |

Both fail open on a missing binary and closed on a policy breach.

## What this layer does not automate

- **Running the full suite** — that is the `pre-push` hook and CI.
- **Pushing or opening a PR** — never without being asked in the session.
- **Deciding the product** — `PRODUCT.md` is the developer's, not an agent's.

## Conventions hierarchy

1. Routing and non-negotiables → `CLAUDE.md`
2. Project law → `.claude/rules/`
3. Technology recipes → `.claude/skills/`
4. Review row → `.claude/rules/architecture-checklist.md`
5. Product, design, style, security prose → `PRODUCT.md`, `DESIGN.md`, `CODE_STYLE.md`, `SECURITY.md`
6. Deployment → `DEPLOYMENT.md` · Security → `SECURITY.md`

Change a convention and every affected layer changes with it, in the same commit.
