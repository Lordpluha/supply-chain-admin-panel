import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Separator } from './separator'

describe('Separator integration', () => {
  /**
   * A rule is decoration between controls. Landing on it while tabbing would be
   * a stop with nothing to do, so it must stay out of the order.
   */
  it('is skipped by the keyboard', async () => {
    render(
      <>
        <button type="button">Before</button>
        <Separator />
        <button type="button">After</button>
      </>,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})
