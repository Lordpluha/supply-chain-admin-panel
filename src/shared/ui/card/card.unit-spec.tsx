import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

describe('Card', () => {
  it('renders its parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Production over time</CardTitle>
          <CardDescription>Total output per year.</CardDescription>
        </CardHeader>
        <CardContent>411,326 t</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Production over time')).toBeInTheDocument()
    expect(screen.getByText('Total output per year.')).toBeInTheDocument()
    expect(screen.getByText('411,326 t')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('records its size, which is what narrows the spacing variable', () => {
    render(<Card data-testid="card" size="sm" />)

    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm')
  })

  it('defaults to the roomier size', () => {
    render(<Card data-testid="card" />)

    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'default')
  })

  it.each([
    [CardHeader, 'card-header'],
    [CardContent, 'card-content'],
    [CardFooter, 'card-footer'],
    [CardAction, 'card-action'],
  ] as const)('marks each part with its slot', (Part, slot) => {
    render(<Part data-testid="part" />)

    expect(screen.getByTestId('part')).toHaveAttribute('data-slot', slot)
  })
})
