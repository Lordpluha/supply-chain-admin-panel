import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders a textbox', () => {
    render(<Input aria-label="Name" />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  it('takes the type it is given', () => {
    render(<Input type="number" aria-label="Capacity" />)

    expect(screen.getByLabelText('Capacity')).toHaveAttribute('type', 'number')
  })

  it('marks itself invalid so the failure is announced', () => {
    render(<Input aria-invalid aria-label="Name" />)

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled when told to be', () => {
    render(<Input disabled aria-label="Name" />)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('carries its slot', () => {
    render(<Input aria-label="Name" />)

    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input')
  })
})
