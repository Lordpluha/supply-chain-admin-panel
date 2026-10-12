import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Button } from '../button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer'

/**
 * An overlay renders into a portal, so the screenshot targets the popup itself
 * rather than a wrapper that never contains it. The baseline lands in
 * `__screenshots__` on the first run — see DEPLOYMENT.md on why that has never
 * happened on the machine this was built on.
 */
describe('Drawer screenshots', () => {
  it('renders open', async () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Which list narrows.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="ghost">Reset</Button>
            <Button variant="outline">Close</Button>
            <Button className="flex-1">Show 3 countries</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )

    const popup = document.querySelector<HTMLElement>('[data-slot="drawer-content"]')

    expect(popup).not.toBeNull()
    await expect(page.elementLocator(popup as HTMLElement)).toMatchScreenshot()
  })
})
