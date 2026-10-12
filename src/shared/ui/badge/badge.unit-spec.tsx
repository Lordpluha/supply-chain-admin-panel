import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders its text', () => {
    render(<Badge>Active</Badge>)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it.each([
    ['default', 'bg-primary'],
    ['secondary', 'bg-secondary'],
    ['outline', 'border-border'],
    ['destructive', 'text-destructive'],
    ['ghost', 'hover:bg-muted'],
  ] as const)('applies the %s variant', (variant, token) => {
    render(<Badge variant={variant}>Status</Badge>)

    expect(screen.getByText('Status')).toHaveClass(token)
  })

  it('carries its slot, so a parent can style around it', () => {
    render(<Badge>Active</Badge>)

    expect(screen.getByText('Active')).toHaveAttribute('data-slot', 'badge')
  })

  /**
   * A badge states a status and the word is the status. Colour never carries it
   * alone — `a11y.md` — so the text has to be there to assert on.
   */
  it('keeps the word, not just the colour', () => {
    render(<Badge variant="secondary">Planned</Badge>)

    expect(screen.getByText('Planned')).toHaveTextContent('Planned')
  })
})
