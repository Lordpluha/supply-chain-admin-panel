---
name: react
description: React 19 conventions — function components only, hook rules, the hooks-wrapping convention over raw query calls in UI, key selection, effect discipline, and what belongs in render versus a memo. Use whenever writing or reviewing a component or a hook.
globs:
  - "src/**/*.tsx"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# React

## Shape

Function components, named exports, arrow consts. No `React.FC`, no default exports (routes
are the exception TanStack Router imposes).

```tsx
export const ProductionSummary = ({ filters }: ProductionSummaryProps) => { … }
```

Props interfaces are named `<Component>Props` and exported when a consumer may need them.

## Hooks

- Top level only. Never in a condition, loop, or callback.
- A custom hook starts with `use` and lives in the slice's `api/` (data) or `lib/` (logic).
- **Hooks-wrapping convention**: UI calls `useCountries()`, not
  `useQuery(countryQueries.listOptions(...))` inline. The wrapper is where the default query
  shape, the `select`, and the empty-state handling live — so changing them touches one file.

```tsx
// ❌ query wiring in the component
const { data } = useQuery(countryQueries.listOptions({ pageSize: 0 }))

// ✅
const { data } = useAllCountries()
```

## Effects are a last resort

An effect is for synchronising with something **outside** React: the DOM, a subscription, a
timer, `document.title`. It is not how derived state is computed.

```tsx
// ❌
const [visible, setVisible] = useState([])
useEffect(() => setVisible(rows.filter(r => r.active)), [rows])

// ✅ — derive during render
const visible = rows.filter(row => row.active)
```

If an effect's only job is to call `setState` from props, delete it.

## Keys

A stable domain id. `key={country.id}`, never the array index — oxlint's
`react/no-array-index-key` is an error here. If a list has no stable id, that is a data problem
to fix upstream, not a reason to use the index.

## Memoisation

Not by default. Reach for `useMemo`/`useCallback` when there is a measured cost or a
referential-identity requirement (a dependency array, a memoised child). Wrapping every
callback is noise that hides the two places it actually matters.

The map widget is the one place in this codebase where projection maths is genuinely memoised,
and it says why in a comment.

## Conditional rendering

Ternaries for either/or, early `return` for guards. Never `&&` with a number on the left —
`{count && <X/>}` renders a literal `0`.

## Component boundaries

See `code-principles.md` for the ≤100 logic lines and ≤5 props limits, and the order in which
to extract when a component outgrows them.
