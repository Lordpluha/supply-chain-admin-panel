import { queryOptions } from '@tanstack/react-query'
import type { CrudService } from './createCrudService'
import type { Identifiable, ListQuery } from './types'

export interface CrudQueriesDeps<TEntity extends Identifiable, TCreate, TUpdate> {
  resource: string
  service: CrudService<TEntity, TCreate, TUpdate>
}

export interface UpdateVariables<TUpdate> {
  id: string
  input: TUpdate
}

/**
 * Turns a service into React Query bindings: cache keys, `queryOptions` for
 * reads, and plain mutation option objects for writes.
 *
 * Mutations carry the keys they invalidate in `meta.invalidates`; a single
 * `MutationCache` subscriber in the app layer performs the invalidation, so no
 * component ever hand-wires `queryClient.invalidateQueries`.
 */
export const createCrudQueries = <TEntity extends Identifiable, TCreate, TUpdate>({
  resource,
  service,
}: CrudQueriesDeps<TEntity, TCreate, TUpdate>) => {
  const keys = {
    all: [resource] as const,
    lists: () => [resource, 'list'] as const,
    list: (query?: ListQuery) => [resource, 'list', query ?? {}] as const,
    details: () => [resource, 'detail'] as const,
    detail: (id: string) => [resource, 'detail', id] as const,
  }

  return {
    keys,

    listOptions: (query?: ListQuery) =>
      queryOptions({
        queryKey: keys.list(query),
        queryFn: () => service.list(query),
      }),

    detailOptions: (id: string) =>
      queryOptions({
        queryKey: keys.detail(id),
        queryFn: () => service.getById(id),
        enabled: Boolean(id),
      }),

    createOptions: () => ({
      mutationFn: (input: TCreate) => service.create(input),
      meta: { invalidates: keys.all },
    }),

    updateOptions: () => ({
      mutationFn: ({ id, input }: UpdateVariables<TUpdate>) => service.update(id, input),
      meta: { invalidates: keys.all },
    }),

    removeOptions: () => ({
      mutationFn: (id: string) => service.remove(id),
      meta: { invalidates: keys.all },
    }),
  }
}

export type CrudQueries<TEntity extends Identifiable, TCreate, TUpdate> = ReturnType<
  typeof createCrudQueries<TEntity, TCreate, TUpdate>
>
