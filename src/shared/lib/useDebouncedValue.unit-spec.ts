import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the value it is given', () => {
    const { result } = renderHook(() => useDebouncedValue('Germ'))

    expect(result.current).toBe('Germ')
  })

  it('holds a change back until the delay has passed', () => {
    const { result, rerender } = renderHook(({ term }) => useDebouncedValue(term), {
      initialProps: { term: 'G' },
    })

    rerender({ term: 'Germany' })
    expect(result.current).toBe('G')

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
    })

    expect(result.current).toBe('Germany')
  })

  /**
   * The point of it: every keystroke would otherwise be a request, and the
   * answers arrive out of order. Only the last term survives the pause.
   */
  it('reports only the last of a burst', () => {
    const { result, rerender } = renderHook(({ term }) => useDebouncedValue(term), {
      initialProps: { term: '' },
    })

    for (const term of ['G', 'Ge', 'Ger', 'Germ']) {
      rerender({ term })
      act(() => {
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 50)
      })
    }

    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
    })

    expect(result.current).toBe('Germ')
  })

  it('takes a delay of its own', () => {
    const { result, rerender } = renderHook(({ term }) => useDebouncedValue(term, 1000), {
      initialProps: { term: 'a' },
    })

    rerender({ term: 'b' })

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('b')
  })
})
