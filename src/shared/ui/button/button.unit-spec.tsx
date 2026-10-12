import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders as a button with its text as the accessible name', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it.each([
    ['default', 'bg-primary'],
    ['outline', 'border-border'],
    ['secondary', 'bg-secondary'],
    ['ghost', 'hover:bg-muted'],
    ['destructive', 'text-destructive'],
    ['link', 'underline-offset-4'],
  ] as const)('applies the %s variant', (variant, token) => {
    render(<Button variant={variant}>Press</Button>)

    expect(screen.getByRole('button')).toHaveClass(token)
  })

  it.each([
    ['xs', 'h-6'],
    ['sm', 'h-8'],
    ['default', 'h-9'],
    ['lg', 'h-10'],
    ['icon', 'size-9'],
  ] as const)('applies the %s size', (size, token) => {
    render(
      <Button size={size} aria-label="Sized">
        A
      </Button>,
    )

    expect(screen.getByRole('button')).toHaveClass(token)
  })

  it('calls its handler when pressed', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when told to be', () => {
    render(<Button disabled>Press</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  /** An icon-only button has no text, so the label is the only name it has. */
  it('takes its name from aria-label when it holds only an icon', () => {
    render(
      <Button size="icon" aria-label="Delete this row">
        <svg aria-hidden="true" />
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Delete this row' })).toBeInTheDocument()
  })

  it('renders as whatever it is told to render as', () => {
    render(<Button nativeButton={false} role="link" render={<a href="/countries">Countries</a>} />)

    expect(screen.getByRole('link', { name: 'Countries' })).toHaveAttribute('href', '/countries')
  })
})
