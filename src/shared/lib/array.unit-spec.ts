import { describe, expect, it } from 'vitest'
import { reversed, sorted } from './array'

describe('sorted', () => {
  it('orders a copy and leaves the original alone', () => {
    const years = [2024, 2010, 2016] as const
    const source = [...years]

    expect(sorted(source)).toEqual([2010, 2016, 2024])
    expect(source).toEqual([...years])
  })

  it('takes a comparator', () => {
    expect(sorted(['b', 'a', 'c'], (a, b) => b.localeCompare(a))).toEqual(['c', 'b', 'a'])
  })

  /** The whole reason it exists: `[...array].sort()` mutates the copy, and the
   *  call sites kept reaching for the original by mistake. */
  it('returns a new array every time', () => {
    const source = [1, 2]

    expect(sorted(source)).not.toBe(source)
  })

  it('copes with nothing to sort', () => {
    expect(sorted([])).toEqual([])
  })
})

describe('reversed', () => {
  it('reverses a copy and leaves the original alone', () => {
    const source = [1, 2, 3]

    expect(reversed(source)).toEqual([3, 2, 1])
    expect(source).toEqual([1, 2, 3])
  })

  it('copes with nothing to reverse', () => {
    expect(reversed([])).toEqual([])
  })
})
