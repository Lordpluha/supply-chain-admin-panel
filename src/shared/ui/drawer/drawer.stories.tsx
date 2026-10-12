import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Button } from '../button'
import { FilterField } from '../filter-field'
import { OptionSelect } from '../option-select'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer'

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          'A bottom sheet with a swipe handle and drag-to-dismiss, for screens with no room for a toolbar. The backdrop’s opacity is tied to the swipe progress, so the sheet feels attached to the finger dragging it. The grip is decorative — the sheet also closes on the backdrop, on Escape, and from its own buttons.',
      },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open the sheet</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                The second list narrows to what actually exists in the first choice.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col gap-3">
              <FilterField label="Country">
                <OptionSelect
                  value=""
                  onChange={() => {}}
                  aria-label="Country"
                  allLabel="Any country"
                  options={[
                    { value: 'de', label: 'Germany' },
                    { value: 'cn', label: 'China' },
                  ]}
                />
              </FilterField>
              <FilterField label="Product">
                <OptionSelect
                  value=""
                  onChange={() => {}}
                  aria-label="Product"
                  allLabel="Any product"
                  options={[{ value: 'li-carb', label: 'Lithium Carbonate' }]}
                />
              </FilterField>
            </div>

            <DrawerFooter>
              <Button variant="ghost" className="shrink-0">
                Reset
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} className="shrink-0">
                Close
              </Button>
              <Button onClick={() => setOpen(false)} className="flex-1">
                Show 3 countries
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  },
}
