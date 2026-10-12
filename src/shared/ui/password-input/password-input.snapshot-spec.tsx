import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { PasswordInput } from './password-input'

describe('PasswordInput snapshots', () => {
  it('matches snapshot', () => {
    const { container } = renderWithProviders(<PasswordInput aria-label="Password" />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
