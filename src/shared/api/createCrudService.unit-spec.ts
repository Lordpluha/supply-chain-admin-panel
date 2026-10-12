import { describe, expect, it } from 'vitest'
import { createCrudService, toSearchParams } from './createCrudService'
import type { HttpClient } from './httpClient'

interface Row {
  id: string
  name: string
}

interface Call {
  url: string
  method?: string
  body?: unknown
  query?: unknown
}

/**
 * No mocking framework anywhere in this file. The transport is a parameter, so
 * a test passes a plain function — which is the entire reason it is a
 * parameter. If a spec here ever needs `vi.mock`, the seam has moved.
 */
const stub = () => {
  const calls: Array<Call> = []

  const http: HttpClient = async (url, options) => {
    calls.push({
      url,
      method: options?.method,
      body: options?.body,
      query: options?.query,
    })
    return undefined as never
  }

  return {
    calls,
    service: createCrudService<Row, { name: string }, { name?: string }>({
      http,
      resource: 'widgets',
    }),
  }
}

describe('toSearchParams', () => {
  it('flattens filters alongside the envelope', () => {
    expect(
      toSearchParams({ search: 'de', page: 2, filters: { region: 'Europe', year: 2026 } }),
    ).toEqual({ search: 'de', page: '2', region: 'Europe', year: '2026' })
  })

  it('drops empty values rather than sending them', () => {
    // An empty filter must not narrow anything — sending `region=` would.
    expect(toSearchParams({ search: '', filters: { region: '', status: undefined } })).toEqual({})
  })

  it('joins an array filter into one parameter', () => {
    expect(toSearchParams({ filters: { id: ['a', 'b'] } })).toEqual({ id: 'a,b' })
  })
})

describe('createCrudService', () => {
  it('builds the five standard paths', async () => {
    const { calls, service } = stub()

    await service.list({ search: 'x' })
    await service.getById('42')
    await service.create({ name: 'New' })
    await service.update('42', { name: 'Edited' })
    await service.remove('42')

    expect(calls.map(c => `${c.method ?? 'GET'} ${c.url}`)).toEqual([
      'GET /widgets',
      'GET /widgets/42',
      'POST /widgets',
      'PATCH /widgets/42',
      'DELETE /widgets/42',
    ])
  })

  it('sends the query envelope on list and the body on writes', async () => {
    const { calls, service } = stub()

    await service.list({ sortBy: 'name', sortDir: 'desc' })
    await service.create({ name: 'New' })

    expect(calls[0].query).toEqual({ sortBy: 'name', sortDir: 'desc' })
    expect(calls[1].body).toEqual({ name: 'New' })
  })

  it('resolves remove to void rather than the response', async () => {
    const { service } = stub()
    await expect(service.remove('42')).resolves.toBeUndefined()
  })
})
