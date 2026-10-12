import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders a placeholder', () => {
    render(<Skeleton data-testid="placeholder" />)

    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
  })

  it('takes the size it is given', () => {
    render(<Skeleton className="h-40 w-full" data-testid="placeholder" />)

    expect(screen.getByTestId('placeholder')).toHaveClass('h-40', 'w-full')
  })

  /** It stands in for content, so it must not be announced as content. */
  it('has no role of its own', () => {
    render(<Skeleton data-testid="placeholder" />)

    expect(screen.getByTestId('placeholder')).not.toHaveAttribute('role')
  })
})
