# Templates

Canonical slice trees, consumed through the `fsd` skill. Copy the tree, then replace:

| Placeholder | Example |
|---|---|
| `__NameKebab__` | `production-record` |
| `__NameCamel__` | `productionRecord` |
| `__NamePascal__` | `ProductionRecord` |

Delete the segments the slice does not need. An empty `lib/` is noise, not structure.

Changing a template means changing `.claude/skills/fsd/SKILL.md` and checklist row **FSD-5**
in the same commit.
