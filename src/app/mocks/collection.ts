import type { Identifiable, ListQuery, Paginated } from '@/shared/api/types'
import { sorted } from '@/shared/lib/array'

export type Comparable = string | number | boolean | null | undefined

export interface CollectionConfig<T extends Identifiable> {
  /** Fields scanned by the `search` term. */
  searchable: ReadonlyArray<keyof T>
  /** Field-level predicates for anything `filters` may carry. */
  filters?: Record<string, (item: T, value: string) => boolean>
}

export interface Collection<T extends Identifiable> {
  all: () => Array<T>
  find: (id: string) => T | undefined
  query: (query?: ListQuery) => Paginated<T>
  insert: (input: Omit<T, 'id'>) => T
  update: (id: string, patch: Partial<Omit<T, 'id'>>) => T | undefined
  remove: (id: string) => boolean
  reset: (next: Array<T>) => void
}

const compare = (a: Comparable, b: Comparable): number => {
  if (a === b) return 0
  if (a === null || a === undefined) return -1
  if (b === null || b === undefined) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

let idCounter = 0
const nextId = (prefix: string): string => {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}`
}

/**
 * A tiny in-memory table: the mock persistence layer every resource handler
 * sits on. Sorting, searching, filtering and pagination live here once instead
 * of being re-implemented per handler.
 */
export const createCollection = <T extends Identifiable>(
  prefix: string,
  seed: Array<T>,
  config: CollectionConfig<T>,
): Collection<T> => {
  let rows: Array<T> = [...seed]

  const query = (listQuery: ListQuery = {}): Paginated<T> => {
    const { search, page = 1, pageSize = 25, sortBy, sortDir = 'asc', filters = {} } = listQuery

    let result = rows

    if (search) {
      const needle = search.toLowerCase()
      result = result.filter(item =>
        config.searchable.some(field =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(needle),
        ),
      )
    }

    for (const [key, raw] of Object.entries(filters)) {
      if (raw === undefined || raw === '') continue
      const predicate = config.filters?.[key]
      if (!predicate) continue
      const value = String(raw)
      result = result.filter(item => predicate(item, value))
    }

    if (sortBy) {
      const direction = sortDir === 'desc' ? -1 : 1
      result = sorted(
        result,
        (a, b) =>
          direction *
          compare(a[sortBy as keyof T] as Comparable, b[sortBy as keyof T] as Comparable),
      )
    }

    const total = result.length
    // `pageSize: 0` is the documented "give me everything" escape hatch used by
    // the selects that must list every option.
    const size = pageSize === 0 ? total : pageSize
    const start = (page - 1) * size

    return {
      items: size === 0 ? [] : result.slice(start, start + size),
      total,
      page,
      pageSize: size,
    }
  }

  return {
    all: () => rows,
    find: id => rows.find(row => row.id === id),
    query,
    insert: input => {
      const created = { ...input, id: nextId(prefix) } as T
      rows = [created, ...rows]
      return created
    },
    update: (id, patch) => {
      const index = rows.findIndex(row => row.id === id)
      if (index === -1) return undefined
      const updated = { ...rows[index], ...patch } as T
      rows = rows.map((row, i) => (i === index ? updated : row))
      return updated
    },
    remove: id => {
      const before = rows.length
      rows = rows.filter(row => row.id !== id)
      return rows.length < before
    },
    reset: next => {
      rows = [...next]
    },
  }
}
