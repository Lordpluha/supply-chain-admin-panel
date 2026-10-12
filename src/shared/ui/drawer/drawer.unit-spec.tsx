import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer'

const renderDrawer = (open = true) =>
  render(
    <Drawer open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Which list narrows.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <button type="button">Close</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  )

describe('Drawer', () => {
  it('renders nothing while closed', () => {
    renderDrawer(false)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a dialog named by its title', () => {
    renderDrawer()

    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
  })

  /**
   * The grip is a hint, not the only way out: the sheet also closes on the
   * backdrop, on Escape, and from its own buttons — so it stays decorative.
   */
  it('hides the swipe handle from assistive technology', () => {
    renderDrawer()

    const handle = document
      .querySelector('[data-slot="drawer-content"]')
      ?.querySelector('[aria-hidden="true"]')

    expect(handle).toBeInTheDocument()
  })

  it('keeps its footer visible while the body scrolls', () => {
    renderDrawer()

    expect(document.querySelector('[data-slot="drawer-footer"]')).toHaveClass('sticky')
  })
})
