import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Label } from '../label'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './combobox'

interface Option {
  value: string
  label: string
}

const COUNTRIES: ReadonlyArray<Option> = [
  { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' },
  { value: 'cd', label: 'DR Congo' },
  { value: 'cl', label: 'Chile' },
]

const meta = {
  title: 'Primitives/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          'The Base UI primitive behind `SearchableSelect`. The value is the option **object**, not its id — bound to the id, the input renders the raw value and the reader sees `de` where they expect `Germany`.',
      },
    },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Option | null>(null)

    return (
      <div className="flex w-64 flex-col gap-1.5">
        <Label htmlFor="country-combobox">Country</Label>
        <Combobox
          items={COUNTRIES}
          value={value}
          onValueChange={next => setValue((next as Option) ?? null)}
          itemToStringLabel={item => (item as Option).label}
        >
          <ComboboxInput
            id="country-combobox"
            placeholder="Any country"
            triggerLabel="Show countries"
          />
          <ComboboxContent>
            <ComboboxEmpty>Nothing matches</ComboboxEmpty>
            <ComboboxList>
              {(item: Option) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    )
  },
}
