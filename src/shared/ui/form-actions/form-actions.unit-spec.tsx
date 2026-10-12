import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { FormActions } from './form-actions'

describe('FormActions', () => {
  it('offers cancel and save', () => {
    renderWithProviders(<FormActions isPending={false} onCancel={() => {}} />)

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('submits the form it sits in, rather than needing a handler', () => {
    renderWithProviders(<FormActions isPending={false} onCancel={() => {}} />)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit')
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('type', 'button')
  })

  /** `isPending` is the single source for "do not submit this twice". */
  it('locks both buttons while the mutation is in flight', () => {
    renderWithProviders(<FormActions isPending onCancel={() => {}} />)

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  })
})
