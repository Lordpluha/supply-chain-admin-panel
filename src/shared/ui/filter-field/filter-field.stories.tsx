import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Input } from '../input'
import { OptionSelect } from '../option-select'
import { FilterField } from './filter-field'

const meta = {
  title: 'Filters/FilterField',
  component: FilterField,
  parameters: {
    docs: {
      description: {
        component:
          'A row of bare selects reading "All", "All", "All" names the current value and never the question. Without `htmlFor` the caption is `aria-hidden` and the control keeps the same string as its `aria-label` — both read from the same translation key, so they cannot drift.',
      },
    },
  },
  args: { label: 'Region', children: null },
} satisfies Meta<typeof FilterField>

export default meta
type Story = StoryObj<typeof meta>

/** A real `<label for>`, because the search box is an `<input>`. */
export const WithInput: Story = {
  render: () => (
    <FilterField label="Search" htmlFor="filter-search" className="w-64">
      <Input id="filter-search" type="search" placeholder="Search" />
    </FilterField>
  ),
}

/** A select trigger is a `<button>`, which `<label for>` cannot bind to. */
export const WithSelect: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <FilterField label="Region">
        <OptionSelect
          value={value}
          onChange={setValue}
          aria-label="Region"
          allLabel="All"
          options={[
            { value: 'Europe', label: 'Europe' },
            { value: 'Asia', label: 'Asia' },
          ]}
        />
      </FilterField>
    )
  },
}

export const AsAToolbar: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-2">
      <FilterField label="Search" htmlFor="toolbar-search" className="w-52">
        <Input id="toolbar-search" type="search" placeholder="Search" />
      </FilterField>
      <FilterField label="Kind">
        <OptionSelect
          value=""
          onChange={() => {}}
          aria-label="Kind"
          allLabel="All"
          options={[
            { value: 'mine', label: 'Mine' },
            { value: 'gigafactory', label: 'Gigafactory' },
          ]}
        />
      </FilterField>
      <FilterField label="Status">
        <OptionSelect
          value=""
          onChange={() => {}}
          aria-label="Status"
          allLabel="All"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'planned', label: 'Planned' },
          ]}
        />
      </FilterField>
    </div>
  ),
}
