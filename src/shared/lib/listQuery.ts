import type { ParserBuilder } from 'nuqs'
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { ListQuery, SortDirection } from '@/shared/api'

export const PAGE_SIZES = [10, 25, 50, 100] as const

export const DEFAULT_PAGE_SIZE = 25

/**
 * The state every list screen shares, held in the URL rather than in React.
 * A filtered, sorted, paginated view is then a link somebody can paste into a
 * message and open on exactly the rows you were looking at.
 */
export const listQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  sortBy: parseAsString.withDefault(''),
  sortDir: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc'),
}

export interface SortState {
  sortBy: string
  sortDir: SortDirection
}

/** What a `null` means to nuqs: drop the key and fall back to the default. */
export interface NextSort {
  sortBy: string | null
  sortDir: SortDirection | null
}

/**
 * Three states, not two: ascending → descending → **off**.
 *
 * A two-state toggle has no way back to the order the API returned, which is
 * often the one a reader wants — "newest first" on the activity log, the seeded
 * order everywhere else. Cycling off clears both keys from the URL, so the link
 * is again the unsorted view rather than one that merely looks unsorted.
 *
 * Pure, and exported, because the cycle is the part worth pinning down; the
 * rest of `toggleSort` is nuqs plumbing.
 */
export const nextSort = (current: SortState, column: string): NextSort => {
  if (current.sortBy !== column) return { sortBy: column, sortDir: 'asc' }
  if (current.sortDir === 'asc') return { sortBy: column, sortDir: 'desc' }
  return { sortBy: null, sortDir: null }
}

export type FilterParsers = Record<string, ParserBuilder<string>>

export interface UseListQueryResult<F extends FilterParsers> {
  /** Ready to hand to a `listOptions(...)` call. */
  query: ListQuery
  search: string
  page: number
  pageSize: number
  sortBy: string
  sortDir: SortDirection
  filters: { [K in keyof F]: string }
  setSearch: (value: string) => void
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  toggleSort: (column: string) => void
  setFilter: (key: keyof F & string, value: string | null) => void
  reset: () => void
  isFiltered: boolean
}

/**
 * `filterParsers` is whatever the screen narrows by — a region, a status, a
 * country. Keeping it open lets one hook serve every list without widening the
 * contract for the screens that filter by nothing.
 *
 * The shared state and the per-screen filters are two separate `useQueryStates`
 * calls on purpose: merging them into one object makes the generic parameter
 * collapse nuqs's per-key parser inference, and every setter starts taking
 * `never`.
 */
export const useListQuery = <F extends FilterParsers>(filterParsers: F): UseListQueryResult<F> => {
  const [base, setBase] = useQueryStates(listQueryParsers, { history: 'replace' })
  const [filterState, setFilterState] = useQueryStates(filterParsers, { history: 'replace' })

  const filters = filterState as { [K in keyof F]: string }

  const query = useMemo<ListQuery>(
    () => ({
      search: base.search || undefined,
      page: base.page,
      pageSize: base.pageSize,
      sortBy: base.sortBy || undefined,
      sortDir: base.sortDir,
      filters: Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value != null),
      ),
    }),
    [base.page, base.pageSize, base.search, base.sortBy, base.sortDir, filters],
  )

  // Any change that narrows the result set sends the reader back to page 1 —
  // staying on page 7 of a set that now has two pages shows an empty table.
  const setSearch = useCallback(
    (value: string) => {
      void setBase({ search: value || null, page: null })
    },
    [setBase],
  )

  const setFilter = useCallback(
    (key: keyof F & string, value: string | null) => {
      void setFilterState({ [key]: value || null } as never)
      void setBase({ page: null })
    },
    [setBase, setFilterState],
  )

  const setPage = useCallback(
    (value: number) => {
      void setBase({ page: value })
    },
    [setBase],
  )

  const setPageSize = useCallback(
    (value: number) => {
      void setBase({ pageSize: value, page: null })
    },
    [setBase],
  )

  const toggleSort = useCallback(
    (column: string) => {
      void setBase(current => ({ ...nextSort(current, column), page: null }))
    },
    [setBase],
  )

  const reset = useCallback(() => {
    void setBase(null)
    void setFilterState(null)
  }, [setBase, setFilterState])

  const isFiltered =
    Boolean(base.search) || Object.values(filters).some(value => value !== '' && value != null)

  return {
    query,
    search: base.search,
    page: base.page,
    pageSize: base.pageSize,
    sortBy: base.sortBy,
    sortDir: base.sortDir,
    filters,
    setSearch,
    setPage,
    setPageSize,
    toggleSort,
    setFilter,
    reset,
    isFiltered,
  }
}
