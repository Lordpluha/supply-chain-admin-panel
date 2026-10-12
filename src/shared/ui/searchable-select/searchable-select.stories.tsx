import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { SearchableSelect } from './searchable-select'

const COUNTRIES = [
  { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' },
  { value: 'cd', label: 'DR Congo' },
  { value: 'au', label: 'Australia' },
  { value: 'cl', label: 'Chile' },
  { value: 'us', label: 'United States' },
]

const meta = {
  title: 'Filters/SearchableSelect',
  component: SearchableSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Two modes, and the difference is one prop. **Without `onSearch`** it filters the options it was given, in the browser. **With `onSearch`** it reports the term and renders whatever comes back, so a list of thousands never has to be shipped to filter three of them.',
      },
    },
  },
  args: { value: '', options: COUNTRIES, onChange: () => {} },
} satisfies Meta<typeof SearchableSelect>

export default meta
type Story = StoryObj<typeof meta>

/** Local filtering — the whole list is already in hand. */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <SearchableSelect
          value={value}
          onChange={setValue}
          options={COUNTRIES}
          allLabel="Any country"
          placeholder="Any country"
          aria-label="Country"
        />
      </div>
    )
  },
}

/** Server-side search: the term is reported and the caller supplies the results. */
export const Async: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [term, setTerm] = useState('')
    const matches = COUNTRIES.filter(country =>
      country.label.toLowerCase().includes(term.toLowerCase()),
    )

    return (
      <div className="w-64">
        <SearchableSelect
          value={value}
          onChange={setValue}
          onSearch={setTerm}
          options={matches}
          allLabel="Any country"
          placeholder="Any country"
          aria-label="Country"
        />
      </div>
    )
  },
}

export const Loading: Story = {
  render: () => (
    <div className="w-64">
      <SearchableSelect
        value=""
        onChange={() => {}}
        onSearch={() => {}}
        isLoading
        options={[]}
        placeholder="Any country"
        aria-label="Country"
      />
    </div>
  ),
}
