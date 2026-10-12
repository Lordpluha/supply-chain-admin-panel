import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import type { RangeSelectValue } from './range-select'
import { RangeSelect } from './range-select'

const YEARS = Array.from({ length: 17 }, (_, index) => {
  const year = String(2010 + index)
  return { value: year, label: year }
})

const meta = {
  title: 'Filters/RangeSelect',
  component: RangeSelect,
  parameters: {
    docs: {
      description: {
        component:
          'A range as two selects, joined into one control. It replaced a two-thumb slider, which read well and dragged badly: the value only existed while a thumb was held, every filter beside it reflowed as the row grew and shrank mid-drag, and on a touch screen the map scrolled instead. Two selects commit one value at a time and hold still while they do it.\n\nThe ends cannot be inverted, because neither is offered a value past the other.',
      },
    },
  },
  args: {
    label: 'Years',
    options: YEARS,
    value: { from: '2010', to: '2026' },
    onChange: () => {},
  },
} satisfies Meta<typeof RangeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<RangeSelectValue>({ from: '2010', to: '2026' })

    return (
      <div className="w-72">
        <RangeSelect label="Years" options={YEARS} value={value} onChange={setValue} />
      </div>
    )
  },
}

/** Narrowed: neither end will now offer a value past the other. */
export const Narrowed: Story = {
  render: () => {
    const [value, setValue] = useState<RangeSelectValue>({ from: '2016', to: '2022' })

    return (
      <div className="w-72">
        <RangeSelect label="Years" options={YEARS} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithAnExplanation: Story = {
  render: () => {
    const [value, setValue] = useState<RangeSelectValue>({ from: '2010', to: '2026' })

    return (
      <div className="w-72">
        <RangeSelect
          label="Years"
          options={YEARS}
          value={value}
          onChange={setValue}
          slots={{ info: 'Both ends move. Neither is offered a value past the other.' }}
        />
      </div>
    )
  },
}
