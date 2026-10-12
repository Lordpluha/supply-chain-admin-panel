import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Masonry, MasonryItem } from './masonry'

describe('Masonry', () => {
  it('renders what it is given', () => {
    render(
      <Masonry>
        <MasonryItem>Summary</MasonryItem>
        <MasonryItem>By product</MasonryItem>
      </Masonry>,
    )

    expect(screen.getByText('Summary')).toBeInTheDocument()
    expect(screen.getByText('By product')).toBeInTheDocument()
  })

  it.each([
    [2, 'sm:columns-2'],
    [3, 'xl:columns-3'],
    [4, '2xl:columns-4'],
  ] as const)('opens up to %i columns', (columns, token) => {
    const { container } = render(<Masonry columns={columns}>cell</Masonry>)

    expect(container.firstChild).toHaveClass(token)
  })

  it('starts at one column, so a phone gets a single stack', () => {
    const { container } = render(<Masonry>cell</Masonry>)

    expect(container.firstChild).toHaveClass('columns-1')
  })

  /**
   * `break-inside-avoid` is the whole reason `MasonryItem` exists: without it a
   * card is sliced across a column boundary.
   */
  it('keeps a cell from being sliced across columns', () => {
    const { container } = render(<MasonryItem>cell</MasonryItem>)

    expect(container.firstChild).toHaveClass('break-inside-avoid')
  })
})
