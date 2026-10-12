import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/shared/api'
import { Providers } from '@/shared/lib/test-utils'
import { AppErrorPage } from './AppErrorPage'

// The route intentionally throws. Keep unexpected diagnostics visible.
beforeEach(() => {
  const warn = console.warn.bind(console)
  vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    if (args.length === 1 && args[0] === 'Warning: Error in route match: //') return
    warn(...args)
  })
})

afterEach(() => vi.restoreAllMocks())

/**
 * Mounted through a real router rather than in isolation: what is being tested
 * is the wiring — that a route which throws lands on this screen, and that
 * "try again" reaches the router rather than only clearing the boundary.
 */
const renderThrowingRoute = (thrown: unknown) => {
  const rootRoute = createRootRoute()

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => {
      throw thrown
    },
    errorComponent: ({ error, reset }) => <AppErrorPage error={error} reset={reset} />,
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  render(
    <Providers>
      <RouterProvider router={router as never} />
    </Providers>,
    { onCaughtError: error => expect(error).toBe(thrown) },
  )

  return router
}

describe('AppErrorPage', () => {
  it('catches a route that throws and offers a way forward', async () => {
    renderThrowingRoute(new Error('render blew up'))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeInTheDocument()

    // Never a dead end: both offers are present and reachable by name.
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload the page' })).toBeInTheDocument()
  })

  it('invalidates the router on retry, so a recovered request actually re-runs', async () => {
    const router = renderThrowingRoute(new Error('render blew up'))
    const invalidate = vi.spyOn(router, 'invalidate')

    await screen.findByRole('heading', { level: 1, name: 'Something went wrong' })
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => expect(invalidate).toHaveBeenCalled())
  })

  /**
   * A loader that failed on a request describes itself through the same mapping
   * the toasts use — "that record no longer exists" beats the generic crash
   * copy where the server actually said which.
   */
  it('prefers the API status message over the generic wording', async () => {
    renderThrowingRoute(new ApiError(404, 'Not found'))

    expect(await screen.findByText('That record no longer exists.')).toBeInTheDocument()
  })

  /** A 409 carries a sentence written for a human; it wins over the status key. */
  it('shows the reason the server wrote, when it wrote one', async () => {
    renderThrowingRoute(
      new ApiError(409, 'Conflict', { message: 'Remove the facilities in this country first' }),
    )

    expect(
      await screen.findByText('Remove the facilities in this country first'),
    ).toBeInTheDocument()
  })
})
