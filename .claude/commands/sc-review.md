---
description: Review the current diff against this repo's architecture checklist.
argument-hint: [path] [--staged]
allowed-tools: Read, Glob, Bash, Agent, Skill
---

Review the current diff${ARGUMENTS:+ scoped to: $ARGUMENTS}.

Dispatch `sc-reviewer`. It:

1. Runs the mechanical pass — `pnpm lint && pnpm check && pnpm typecheck && pnpm test` — and
   reports the **real** output.
2. Walks every row of `.claude/rules/architecture-checklist.md`, marking each `pass` / `fail` /
   `n/a`, with `file:line` for each fail.
3. Re-reads the original request and says, part by part, whether the diff meets it.

Returns `PASS` / `PARTIAL` / `FAIL`. A diff that is mechanically clean but does the wrong thing
is a `FAIL`.

The reviewer does not edit code. Apply the findings yourself, or hand them to
`sc-frontend-developer`.
