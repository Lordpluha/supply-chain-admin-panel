import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slot } from './slot'

describe('Slot', () => {
  /** The point: the caller's element survives, with its semantics intact. */
  it('keeps the child element rather than wrapping it', () => {
    const { container } = render(
      <Slot className="typo-label">
        <a href="/countries">Countries</a>
      </Slot>,
    )

    expect(screen.getByRole('link', { name: 'Countries' })).toBeInTheDocument()
    expect(container.querySelector('div')).toBeNull()
  })

  it('merges its class onto the child', () => {
    render(
      <Slot className="typo-label">
        <a href="/countries" className="underline">
          Countries
        </a>
      </Slot>,
    )

    expect(screen.getByRole('link')).toHaveClass('typo-label', 'underline')
  })

  it('passes its own props down', () => {
    render(
      <Slot data-slot="badge">
        <a href="/countries">Countries</a>
      </Slot>,
    )

    expect(screen.getByRole('link')).toHaveAttribute('data-slot', 'badge')
  })

  /** The child is more specific than the wrapper, so it wins a conflict. */
  it('lets the child override what it was given', () => {
    render(
      <Slot id="outer">
        <a href="/countries" id="inner">
          Countries
        </a>
      </Slot>,
    )

    expect(screen.getByRole('link')).toHaveAttribute('id', 'inner')
  })

  it('renders nothing when there is no element to merge onto', () => {
    const { container } = render(<Slot className="typo-label">plain text</Slot>)

    expect(container).toBeEmptyDOMElement()
  })
})
