import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { PasswordInput } from './password-input'

const field = () => screen.getByLabelText('Password')

describe('PasswordInput integration', () => {
  it('reveals and hides again, without losing what was typed', async () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    await userEvent.type(field(), 'supply-chain')
    expect(field()).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))

    expect(field()).toHaveAttribute('type', 'text')
    expect(field()).toHaveValue('supply-chain')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }))

    expect(field()).toHaveAttribute('type', 'password')
    expect(field()).toHaveValue('supply-chain')
  })

  /** The reveal sits inside the sign-in form; pressing it must not submit one. */
  it('does not submit the form it sits in', async () => {
    const onSubmit = vi.fn(event => event.preventDefault())
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <PasswordInput aria-label="Password" />
      </form>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('is reachable from the field by tabbing', async () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    await userEvent.tab()
    expect(field()).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
  })
})
