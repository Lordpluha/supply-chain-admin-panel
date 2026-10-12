import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useIsMobile, useMediaQuery } from './useMediaQuery'

interface FakeList {
  matches: boolean
  media: string
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

const stubMatchMedia = (matches: boolean) => {
  const listeners = new Set<() => void>()

  const list: FakeList = {
    matches,
    media: '',
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ ...list, media: query })),
  )

  return {
    change(next: boolean) {
      list.matches = next
      for (const listener of listeners) listener()
    },
    listenerCount: () => listeners.size,
  }
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports whether the query matches right now', () => {
    stubMatchMedia(true)

    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'))

    expect(result.current).toBe(true)
  })

  it('follows the query when it changes', () => {
    const media = stubMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'))

    expect(result.current).toBe(false)

    act(() => {
      media.change(true)
    })

    expect(result.current).toBe(true)
  })

  /** A subscription left behind keeps a torn-down tree alive. */
  it('unsubscribes when it goes away', () => {
    const media = stubMatchMedia(false)
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 767px)'))

    expect(media.listenerCount()).toBe(1)

    unmount()

    expect(media.listenerCount()).toBe(0)
  })
})

describe('useIsMobile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks about the breakpoint the layout actually changes at', () => {
    stubMatchMedia(false)

    renderHook(() => useIsMobile())

    expect(globalThis.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })
})
