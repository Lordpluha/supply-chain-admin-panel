import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

beforeAll(() => {
  // jsdom implements neither, and both are used by the app shell and the map.
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )

  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    },
  )

  // jsdom implements neither and throws "Not implemented" instead — noisy on
  // every run, and fatal when the call happens in a `requestAnimationFrame`
  // after the test that scheduled it has already finished.
  Element.prototype.scrollIntoView ??= () => {}
  // `scrollTo` exists in jsdom but throws, so `??=` would not replace it.
  vi.stubGlobal('scrollTo', vi.fn())
})
