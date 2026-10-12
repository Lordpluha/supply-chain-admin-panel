import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

const renderDialog = (open = true) =>
  render(
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New country</DialogTitle>
          <DialogDescription>Producing countries and their coordinates.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button type="button">Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  )

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    renderDialog(false)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a dialog named by its title', () => {
    renderDialog()

    expect(screen.getByRole('dialog', { name: 'New country' })).toBeInTheDocument()
  })

  it('takes its description as the accessible description', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toHaveAccessibleDescription(
      'Producing countries and their coordinates.',
    )
  })

  it('offers a close control of its own', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  /**
   * A centred, fixed popup taller than the viewport hangs off both ends with
   * its buttons out of reach, so it caps its height and scrolls inside itself.
   */
  it('caps its height and scrolls rather than overflowing the viewport', () => {
    renderDialog()

    const content = document.querySelector('[data-slot="dialog-content"]')

    expect(content).toHaveClass('max-h-[calc(100dvh-2rem)]', 'overflow-y-auto')
  })
})
