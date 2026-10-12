import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Typography } from './typography'

describe('Typography', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)('renders level %i as a real heading', level => {
    render(<Typography level={level}>Heading</Typography>)

    expect(screen.getByRole('heading', { level, name: 'Heading' })).toBeInTheDocument()
  })

  it('renders a paragraph when given no level', () => {
    const { container } = render(<Typography>Body</Typography>)

    expect(container.firstChild?.nodeName).toBe('P')
  })

  it.each([
    ['display', 'typo-display'],
    ['h3', 'typo-h3'],
    ['body', 'typo-body'],
    ['caption', 'typo-caption'],
    ['code', 'typo-code'],
  ] as const)('applies the %s step', (size, token) => {
    render(<Typography size={size}>Text</Typography>)

    expect(screen.getByText('Text')).toHaveClass(token)
  })

  it.each([
    ['muted', 'text-muted-foreground'],
    ['primary', 'text-primary'],
    ['destructive', 'text-destructive'],
    ['success', 'text-success'],
    ['warning', 'text-warning'],
  ] as const)('applies the %s tone', (tone, token) => {
    render(<Typography tone={tone}>Text</Typography>)

    expect(screen.getByText('Text')).toHaveClass(token)
  })

  /**
   * Size and semantics are separate: something that must look like a heading
   * without becoming one in the document outline.
   */
  it('takes a size without taking the element', () => {
    render(
      <Typography as="p" size="h3">
        Looks like a heading
      </Typography>,
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Looks like a heading')).toHaveClass('typo-h3')
  })

  it('records its level as data, for styling that depends on it', () => {
    render(<Typography level={2}>Heading</Typography>)

    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('data-level', '2')
  })
})
