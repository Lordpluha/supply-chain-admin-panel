import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './drawer'

const Harness = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Filters
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <button type="button" onClick={() => setOpen(false)}>
            Show 3 countries
          </button>
        </DrawerContent>
      </Drawer>
    </>
  )
}

describe('Drawer integration', () => {
  it('opens from its trigger', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))

    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
  })

  it('closes on Escape, without needing the swipe', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes from a button in its own footer', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Show 3 countries' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
