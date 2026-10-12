import { afterEach, describe, expect, it, vi } from 'vitest'
import { awaitRequestGate, setRequestGate } from './requestGate'

afterEach(() => {
  setRequestGate(() => Promise.resolve())
})

describe('requestGate', () => {
  /** A test or a story pays nothing for it until the app registers one. */
  it('is open until something closes it', async () => {
    await expect(awaitRequestGate()).resolves.toBeUndefined()
  })

  it('waits on whatever was registered', async () => {
    const gate = vi.fn(() => Promise.resolve())
    setRequestGate(gate)

    await awaitRequestGate()

    expect(gate).toHaveBeenCalledTimes(1)
  })

  /**
   * The gate is on the transport, not on the render, because a route's
   * `beforeLoad` fetches outside the React tree — so it has to hold every
   * request, however many, until the worker is up.
   */
  it('holds every request, not only the first', async () => {
    // `Promise.withResolvers` is ES2024, past this project's target — see the
    // note in `shared/lib/array.ts` about the support floor.
    const deferred: { release: () => void } = { release: () => {} }
    const opened = new Promise<void>(resolve => {
      deferred.release = resolve
    })

    setRequestGate(() => opened)

    const settled: Array<string> = []
    const first = awaitRequestGate().then(() => settled.push('first'))
    const second = awaitRequestGate().then(() => settled.push('second'))

    expect(settled).toEqual([])

    deferred.release()
    await Promise.all([first, second])

    expect(settled).toEqual(['first', 'second'])
  })

  it('takes the newest gate it was given', async () => {
    const first = vi.fn(() => Promise.resolve())
    const second = vi.fn(() => Promise.resolve())

    setRequestGate(first)
    setRequestGate(second)
    await awaitRequestGate()

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
