import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button integration', () => {
  it('activates on Enter, so the keyboard reaches it', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('activates on Space as well', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    screen.getByRole('button').focus()
    await userEvent.keyboard(' ')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does nothing at all while disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('is reachable by tabbing', async () => {
    render(
      <>
        <Button>First</Button>
        <Button>Second</Button>
      </>,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()
  })
})
