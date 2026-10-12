import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyUnauthorized, setUnauthorizedHandler } from './unauthorized'

afterEach(() => {
  setUnauthorizedHandler(() => {})
})

describe('unauthorized', () => {
  /**
   * The seam exists so `shared/api` can tell the app a session expired without
   * importing the session store from `entities/`, which the layer order
   * forbids. Unregistered, it must simply do nothing.
   */
  it('does nothing until the app registers a handler', () => {
    expect(() => notifyUnauthorized()).not.toThrow()
  })

  it('calls whatever was registered', () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)

    notifyUnauthorized()

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('takes the newest handler it was given', () => {
    const first = vi.fn()
    const second = vi.fn()

    setUnauthorizedHandler(first)
    setUnauthorizedHandler(second)
    notifyUnauthorized()

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
