import type { HttpClient } from './httpClient'
import type { Identifiable, ListQuery, Paginated } from './types'

/**
 * Read and write halves are declared separately so a consumer that only reads
 * never has to depend on the mutating half (interface segregation). A
 * read-only resource simply exposes `ReadableService`.
 */
export interface ReadableService<TEntity> {
  list: (query?: ListQuery) => Promise<Paginated<TEntity>>
  getById: (id: string) => Promise<TEntity>
}

export interface WritableService<TEntity, TCreate, TUpdate> {
  create: (input: TCreate) => Promise<TEntity>
  update: (id: string, input: TUpdate) => Promise<TEntity>
  remove: (id: string) => Promise<void>
}

export type CrudService<TEntity, TCreate, TUpdate> = ReadableService<TEntity> &
  WritableService<TEntity, TCreate, TUpdate>

export interface CrudServiceDeps {
  /** Injected, never imported — the seam that keeps services testable. */
  http: HttpClient
  /** Path segment of the collection, e.g. `countries`. */
  resource: string
}

/** Flattens the query envelope into `URLSearchParams`-compatible entries. */
export const toSearchParams = (query: ListQuery = {}): Record<string, string> => {
  const { filters, ...rest } = query
  const entries: Record<string, string> = {}

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== '') entries[key] = String(value)
  }

  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value === undefined || value === '') continue
    entries[key] = Array.isArray(value) ? value.join(',') : String(value)
  }

  return entries
}

/**
 * Builds the five standard operations for one resource. Entity modules spread
 * the result and append their own methods rather than editing this factory —
 * it is closed for modification, open for extension.
 */
export const createCrudService = <TEntity extends Identifiable, TCreate, TUpdate>({
  http,
  resource,
}: CrudServiceDeps): CrudService<TEntity, TCreate, TUpdate> => ({
  list: query => http<Paginated<TEntity>>(`/${resource}`, { query: toSearchParams(query) }),

  getById: id => http<TEntity>(`/${resource}/${id}`),

  create: input =>
    http<TEntity>(`/${resource}`, { method: 'POST', body: input as Record<string, unknown> }),

  update: (id, input) =>
    http<TEntity>(`/${resource}/${id}`, {
      method: 'PATCH',
      body: input as Record<string, unknown>,
    }),

  remove: async id => {
    await http<void>(`/${resource}/${id}`, { method: 'DELETE' })
  },
})
