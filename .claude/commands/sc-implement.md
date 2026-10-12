---
description: Implement a change in this panel end to end — clarify, plan if needed, build, verify, report.
argument-hint: "<task>" [--session] [--plan] [--review]
allowed-tools: Read, Write, Edit, Glob, Bash, Agent, AskUserQuestion, Skill
---

Implement: **$ARGUMENTS**

## Routing

By default this dispatches a specialist rather than working in the current session.

| Flag | Effect |
|---|---|
| *(none)* | Dispatch `sc-frontend-developer` for `src/`, `sc-devops` for everything else. |
| `--plan` | Dispatch `sc-manager` first; show the plan and confirm before any code. |
| `--review` | Dispatch `sc-reviewer` after the change, regardless of diff size. |
| `--session` | Stay in this session. Use only when the change is small enough that dispatch is pure overhead. |

Defect? Route to `sc-debugger` instead. Visual or token work? `sc-designer` produces the spec,
then `sc-frontend-developer` builds it.

## Steps

1. **Read `CLAUDE.md`**, then the rules whose `globs:` match the files this will touch. Do not
   work from memory of the conventions.

2. **Is the task specified?** If two readings would lead to materially different work, grill
   first — decision tree, whole settled frontier in one round, numbered questions each with a
   recommended answer, then wait. Look facts up yourself; only decisions go to the developer.

3. **Plan** when the task spans more than ~3 files or touches a boundary (a new permission, a
   new slice, a new endpoint). `sc-manager` owns this.

4. **Build.** Load the `fsd` skill for any new slice. Reuse before creating.

5. **Verify** — actually run them:

   ```bash
   pnpm verify && pnpm test
   ```

6. **Review.** `sc-reviewer` on a diff over ~100 lines or ~5 files, or on `--review`.

7. **Report**: what changed, which files, which gates ran and their real outcome, and anything
   deliberately left out with the reason.

## Rules

- Never report done with a red gate.
- Never describe a gate you did not run.
- Never push, commit, or open a PR unless the developer asked for it in this session.
