import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from './badge'

describe('Badge integration', () => {
  /**
   * A badge is not a control, so nothing about it is focusable on its own.
   * Inside a link it inherits the link's behaviour — which is the only way it
   * is ever interactive, and what the `[a]:hover` variants are written for.
   */
  it('is carried by a link when it sits inside one', async () => {
    const onClick = vi.fn(event => event.preventDefault())
    render(
      <a href="/countries" onClick={onClick}>
        <Badge>Europe</Badge>
      </a>,
    )

    const link = screen.getByRole('link', { name: 'Europe' })

    await userEvent.tab()
    expect(link).toHaveFocus()

    await userEvent.click(link)
    expect(onClick).toHaveBeenCalled()
  })

  it('is skipped by the keyboard on its own', async () => {
    render(
      <>
        <button type="button">Before</button>
        <Badge>Active</Badge>
        <button type="button">After</button>
      </>,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})
