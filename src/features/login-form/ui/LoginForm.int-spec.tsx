import { QueryClient } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { sessionQueries } from '@/entities/session'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { LoginForm } from './LoginForm'

/**
 * A required field's label carries an `aria-hidden` asterisk, which stays in
 * the label's text even though it is out of the accessible name — so the label
 * lookup matches a prefix. A password input has no `textbox` role to query by.
 */
const passwordField = () => screen.getByLabelText(/^Password/)

describe('LoginForm', () => {
  /**
   * The point of the prototype is the supply map, not a login ceremony — so the
   * seeded operator's credentials are already in the fields.
   */
  it('arrives pre-filled with the seeded operator', () => {
    renderWithProviders(<LoginForm onSuccess={() => {}} />)

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('admin@example.com')
    expect(passwordField()).toHaveValue('supply-chain')
  })

  it('signs in and seeds the session into the cache', async () => {
    const onSuccess = vi.fn()

    /**
     * Not `createTestQueryClient()`: its `gcTime: 0` collects a cache entry the
     * moment it has no observer, and nothing in this tree observes the session
     * — the route guard does, in the app. The seeded entry would vanish before
     * it could be read.
     */
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    renderWithProviders(<LoginForm onSuccess={onSuccess} />, { queryClient })

    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))

    /**
     * Written straight into the cache rather than left to `meta.invalidates`:
     * invalidation races the navigation, and the guard on the next route would
     * read the stale `null` and bounce back here.
     */
    const session = queryClient.getQueryData(sessionQueries.keys.current())
    expect(session).toMatchObject({ user: { email: 'admin@example.com' } })
  })

  it('refuses to send a malformed address, and says which field', async () => {
    renderWithProviders(<LoginForm onSuccess={() => {}} />)

    const email = screen.getByRole('textbox', { name: 'Email' })
    await userEvent.clear(email)
    await userEvent.type(email, 'not-an-address')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'))
    expect(email).toHaveAccessibleDescription(/valid email/i)
  })

  it('refuses an empty password', async () => {
    renderWithProviders(<LoginForm onSuccess={() => {}} />)

    await userEvent.clear(passwordField())
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(passwordField()).toHaveAttribute('aria-invalid', 'true'))
  })

  /** The form renders its own failure inline, so the global toast stays quiet. */
  it('renders a rejected sign-in beside the form, not in a toast', async () => {
    const onSuccess = vi.fn()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    const password = passwordField()
    await userEvent.clear(password)
    await userEvent.type(password, 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('locks the button while the request is in flight', async () => {
    renderWithProviders(<LoginForm onSuccess={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled())
  })
})
