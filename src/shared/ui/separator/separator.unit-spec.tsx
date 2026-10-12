import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from './separator'

describe('Separator', () => {
  it('is horizontal by default', () => {
    render(<Separator data-testid="rule" />)

    expect(screen.getByTestId('rule')).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('can be vertical', () => {
    render(<Separator orientation="vertical" data-testid="rule" />)

    expect(screen.getByTestId('rule')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('carries its slot', () => {
    render(<Separator data-testid="rule" />)

    expect(screen.getByTestId('rule')).toHaveAttribute('data-slot', 'separator')
  })
})
