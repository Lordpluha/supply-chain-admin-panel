import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Masonry, MasonryItem } from './masonry'

describe('Masonry integration', () => {
  /**
   * Multi-column flows top-to-bottom then across, so the *visual* order is not
   * the DOM order. The tab order follows the DOM, which is the one that has to
   * stay sensible — this is why the layout is only for independent panels.
   */
  it('keeps the tab order in DOM order', async () => {
    render(
      <Masonry columns={3}>
        {['First', 'Second', 'Third'].map(label => (
          <MasonryItem key={label}>
            <button type="button">{label}</button>
          </MasonryItem>
        ))}
      </Masonry>,
    )

    for (const label of ['First', 'Second', 'Third']) {
      await userEvent.tab()
      expect(screen.getByRole('button', { name: label })).toHaveFocus()
    }
  })
})
