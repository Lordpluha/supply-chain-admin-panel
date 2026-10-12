import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { OptionSelect } from './option-select'

const REGIONS = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'].map(
  region => ({ value: region, label: region }),
)

const meta = {
  title: 'Filters/OptionSelect',
  component: OptionSelect,
  parameters: {
    docs: {
      description: {
        component:
          'A select over `{ value, label }` that knows nothing about the domain. The trigger is sized to the longest option, so picking a short one does not shrink the control and shift everything beside it.',
      },
    },
  },
  args: { value: '', options: REGIONS, onChange: () => {} },
} satisfies Meta<typeof OptionSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <OptionSelect
        value={value}
        onChange={setValue}
        options={REGIONS}
        allLabel="All"
        aria-label="Region"
      />
    )
  },
}

/**
 * A Base UI item cannot carry an empty string, so "any" needs a sentinel.
 * `SelectValue` is given an explicit function child — without one Base UI
 * prints the raw value and the entry renders as the literal `__all__`.
 */
export const WithAllEntry: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <OptionSelect
        value={value}
        onChange={setValue}
        options={REGIONS}
        allLabel="Any country"
        aria-label="Country"
      />
    )
  },
}

/** Consecutive options sharing a `group` get a heading above the first of them. */
export const Grouped: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <OptionSelect
        value={value}
        onChange={setValue}
        allLabel="Any facility"
        aria-label="Facility"
        options={[
          { value: 'yichun', label: 'Yichun Lithium Refinery', group: 'Refinery' },
          { value: 'ganfeng', label: 'Ganfeng Refinery', group: 'Refinery' },
          { value: 'erfurt', label: 'Erfurt Cell Plant', group: 'Gigafactory' },
        ]}
      />
    )
  },
}
