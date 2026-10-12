import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { RangeFilter } from './range-filter'

const PRICE_BANDS = [0, 5_000, 25_000, 100_000, 1_000_000].map(band => ({
  value: String(band),
  label: `€${band.toLocaleString('en')}`,
}))

const meta = {
  title: 'Filters/RangeFilter',
  component: RangeFilter,
  parameters: {
    docs: {
      description: {
        component:
          'A `RangeSelect` that speaks the URL’s language. An end sitting at its extreme is not a filter, so it is reported as `null` and the key drops out of the address — without that, every list would arrive carrying `priceMin=0` and the reset button would offer to clear a filter nobody set.\n\nThe bands are the caller’s. They are chosen rather than generated: a catalogue spanning a raw material at a few thousand and a finished pack in the millions would put every raw material in one bucket on an evenly spaced scale.',
      },
    },
  },
  args: {
    label: 'Unit price',
    options: PRICE_BANDS,
    value: { from: '', to: '' },
    onChange: () => {},
  },
} satisfies Meta<typeof RangeFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({ from: '', to: '' })

    return (
      <div className="w-72">
        <RangeFilter
          label="Unit price"
          options={PRICE_BANDS}
          value={value}
          onChange={(from, to) => setValue({ from: from ?? '', to: to ?? '' })}
        />
      </div>
    )
  },
}

export const Narrowed: Story = { args: { value: { from: '5000', to: '100000' } } }
