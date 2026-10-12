import { describe, expect, it } from 'vitest'
import { nextSort } from './listQuery'

const unsorted = { sortBy: '', sortDir: 'asc' } as const

describe('nextSort', () => {
  it('starts a new column ascending', () => {
    expect(nextSort(unsorted, 'name')).toEqual({ sortBy: 'name', sortDir: 'asc' })
  })

  it('turns ascending into descending on the same column', () => {
    expect(nextSort({ sortBy: 'name', sortDir: 'asc' }, 'name')).toEqual({
      sortBy: 'name',
      sortDir: 'desc',
    })
  })

  /**
   * The third press is the point of this: `null` drops both keys from the URL,
   * so the list returns to the order the API gave it rather than to an
   * ascending sort that merely looks like the default.
   */
  it('clears the sort on the third press', () => {
    expect(nextSort({ sortBy: 'name', sortDir: 'desc' }, 'name')).toEqual({
      sortBy: null,
      sortDir: null,
    })
  })

  it('restarts at ascending when a different column is pressed', () => {
    expect(nextSort({ sortBy: 'name', sortDir: 'desc' }, 'region')).toEqual({
      sortBy: 'region',
      sortDir: 'asc',
    })
  })

  it('cycles back to where it started after three presses', () => {
    let state: { sortBy: string; sortDir: 'asc' | 'desc' } = { ...unsorted }

    for (let press = 0; press < 3; press += 1) {
      const next = nextSort(state, 'name')
      state = { sortBy: next.sortBy ?? '', sortDir: next.sortDir ?? 'asc' }
    }

    expect(state).toEqual(unsorted)
  })
})
