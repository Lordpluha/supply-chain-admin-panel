import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

describe('DropdownMenu snapshots', () => {
  it('matches snapshot — open', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger render={<button type="button">Row actions</button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toMatchSnapshot()
  })
})
