/**
 * Non-mutating array helpers.
 *
 * `Array#toSorted` and `Array#toReversed` are ES2023 and would do this natively,
 * but their support floor (Firefox 115) sits just above the CSS floor this panel
 * already has (`oklch()`, `@custom-variant` — Firefox 113). Two functions close
 * that gap for less than a polyfill build step costs: `@vitejs/plugin-legacy`
 * with our `browserslist` emitted no polyfill chunk at all, so it was pure build
 * time for nothing.
 *
 * Prefer these over `[...array].sort()` at call sites: the intent reads better,
 * and oxlint's `unicorn/no-array-sort` is satisfied without a suppression.
 */

export const sorted = <T>(array: ReadonlyArray<T>, compare?: (a: T, b: T) => number): Array<T> =>
  [...array].sort(compare)

export const reversed = <T>(array: ReadonlyArray<T>): Array<T> => [...array].reverse()
