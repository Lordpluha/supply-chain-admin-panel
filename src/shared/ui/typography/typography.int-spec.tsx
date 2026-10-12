import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Typography } from './typography'

describe('Typography integration', () => {
  /**
   * The outline is what a screen reader navigates by, so the levels a page
   * renders have to be the levels it means — not whatever looked right.
   */
  it('builds an outline a reader can navigate', () => {
    render(
      <article>
        <Typography level={1}>Countries</Typography>
        <Typography level={2}>Europe</Typography>
        <Typography as="p">Producing countries and their coordinates.</Typography>
        <Typography level={2}>Asia</Typography>
      </article>,
    )

    const headings = screen.getAllByRole('heading')

    expect(headings.map(heading => heading.tagName)).toEqual(['H1', 'H2', 'H2'])
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('wraps a child element instead of nesting another one', () => {
    render(
      <Typography asChild size="label">
        <a href="/countries">Countries</a>
      </Typography>,
    )

    const link = screen.getByRole('link', { name: 'Countries' })

    expect(link).toHaveClass('typo-label')
    expect(link.querySelector('a')).toBeNull()
  })
})
