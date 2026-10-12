import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './drawer'

describe('Drawer snapshots', () => {
  it('matches snapshot — open', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    )

    expect(document.querySelector('[data-slot="drawer-content"]')).toMatchSnapshot()
  })
})
