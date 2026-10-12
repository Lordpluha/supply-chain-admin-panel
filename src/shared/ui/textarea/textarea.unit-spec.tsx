import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders a multi-line textbox', () => {
    render(<Textarea aria-label="Description" />)

    expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument()
  })

  it('takes the row count it is given', () => {
    render(<Textarea aria-label="Description" rows={3} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3')
  })

  it('marks itself invalid so the failure is announced', () => {
    render(<Textarea aria-label="Description" aria-invalid />)

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('carries its slot', () => {
    render(<Textarea aria-label="Description" />)

    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'textarea')
  })
})
