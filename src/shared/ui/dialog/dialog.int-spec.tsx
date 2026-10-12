import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

const Harness = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Create
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New country</DialogTitle>
          </DialogHeader>
          <input aria-label="Name" />
        </DialogContent>
      </Dialog>
    </>
  )
}

describe('Dialog integration', () => {
  it('opens from its trigger and closes on Escape', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(await screen.findByRole('dialog', { name: 'New country' })).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes from its own close button', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  /**
   * Opening moves focus into the dialog — otherwise the keyboard stays behind
   * it and the reader has no way to reach what just appeared. The trap that
   * keeps it there is Base UI's, and needs a real browser to observe; this
   * asserts the part jsdom can see honestly.
   */
  it('moves focus into itself when it opens', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    const dialog = await screen.findByRole('dialog')

    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement))
  })

  /** And returns it to whatever opened it, so the place is not lost. */
  it('returns focus to its trigger when it closes', async () => {
    render(<Harness />)

    const trigger = screen.getByRole('button', { name: 'Create' })
    await userEvent.click(trigger)
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
