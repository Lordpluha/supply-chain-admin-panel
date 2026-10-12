import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { PasswordInput } from './password-input'

const field = () => screen.getByLabelText('Password')

describe('PasswordInput', () => {
  it('hides what is typed by default', () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    expect(field()).toHaveAttribute('type', 'password')
  })

  it('offers a reveal control, named for what pressing it will do', () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  /** Left as a submit it would send the form it sits in. */
  it('is a button, not a submit', () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('says whether the password is currently showing', () => {
    renderWithProviders(<PasswordInput aria-label="Password" />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('passes everything else through to the input', () => {
    renderWithProviders(
      <PasswordInput aria-label="Password" autoComplete="current-password" disabled />,
    )

    expect(field()).toHaveAttribute('autocomplete', 'current-password')
    expect(field()).toBeDisabled()
  })
})
