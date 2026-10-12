import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

const renderMenu = (onOpen = vi.fn()) => {
  render(
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button">Row actions</button>} />
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  )

  return onOpen
}

describe('DropdownMenu integration', () => {
  it('opens on click and runs the item that is chosen', async () => {
    const onOpen = renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Open' }))

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape without running anything', async () => {
    const onOpen = renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }))
    await screen.findByRole('menu')

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('moves between items with the arrow keys', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }))
    await screen.findByRole('menu')

    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()
  })
})
