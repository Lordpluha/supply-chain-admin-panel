import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

const renderMenu = (open = false) =>
  render(
    <DropdownMenu open={open}>
      <DropdownMenuTrigger render={<button type="button">Row actions</button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  )

describe('DropdownMenu', () => {
  it('renders a trigger that announces it opens a menu', () => {
    renderMenu()

    expect(screen.getByRole('button', { name: 'Row actions' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    )
  })

  it('keeps its items out of the page until opened', () => {
    renderMenu()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders one menu item per entry when open', () => {
    renderMenu(true)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('marks a destructive item so it reads as one', () => {
    renderMenu(true)

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'data-variant',
      'destructive',
    )
  })
})
