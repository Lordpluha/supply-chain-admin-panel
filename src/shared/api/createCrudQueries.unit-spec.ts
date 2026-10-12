import { describe, expect, it } from 'vitest'
import { createCrudQueries } from './createCrudQueries'
import type { CrudService } from './createCrudService'
import type { Identifiable } from './types'

interface Country extends Identifiable {
  name: string
}

const service: CrudService<Country, { name: string }, { name?: string }> = {
  list: async () => ({ items: [], total: 0, page: 1, pageSize: 25 }),
  getById: async id => ({ id, name: 'Germany' }),
  create: async input => ({ id: 'de', ...input }),
  update: async (id, input) => ({ id, name: input.name ?? 'Germany' }),
  remove: async () => {},
}

const queries = createCrudQueries({ resource: 'countries', service })

describe('createCrudQueries', () => {
  /**
   * The hierarchy is what makes a broad invalidation catch the narrow ones: a
   * mutation invalidating `['countries']` clears every list and every detail.
   */
  it('nests its keys so one invalidation reaches the rest', () => {
    expect(queries.keys.all).toEqual(['countries'])
    expect(queries.keys.lists()).toEqual(['countries', 'list'])
    expect(queries.keys.list({ search: 'de' })).toEqual(['countries', 'list', { search: 'de' }])
    expect(queries.keys.detail('de')).toEqual(['countries', 'detail', 'de'])
  })

  it('keys an unfiltered list on an empty query, not on undefined', () => {
    expect(queries.keys.list()).toEqual(['countries', 'list', {}])
  })

  it('gives a list its key and a function that fetches it', async () => {
    const options = queries.listOptions({ page: 2 })

    expect(options.queryKey).toEqual(['countries', 'list', { page: 2 }])
    await expect(options.queryFn?.({} as never)).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
    })
  })

  /** An empty id means "nothing selected", which is not a request worth making. */
  it('does not run a detail query without an id', () => {
    expect(queries.detailOptions('de').enabled).toBe(true)
    expect(queries.detailOptions('').enabled).toBe(false)
  })

  /**
   * Mutations declare what they invalidate; one `MutationCache` subscriber in
   * the app layer performs it, so no component ever calls `invalidateQueries`.
   */
  it.each([
    ['createOptions', () => queries.createOptions()],
    ['updateOptions', () => queries.updateOptions()],
    ['removeOptions', () => queries.removeOptions()],
  ] as const)('declares what %s invalidates', (_name, build) => {
    expect(build().meta).toEqual({ invalidates: ['countries'] })
  })

  it('sends a create through the service', async () => {
    await expect(queries.createOptions().mutationFn({ name: 'Chile' })).resolves.toEqual({
      id: 'de',
      name: 'Chile',
    })
  })

  it('sends an update through the service', async () => {
    await expect(
      queries.updateOptions().mutationFn({ id: 'cl', input: { name: 'Chile' } }),
    ).resolves.toEqual({ id: 'cl', name: 'Chile' })
  })
})
