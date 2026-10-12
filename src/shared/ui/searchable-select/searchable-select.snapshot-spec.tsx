import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { SearchableSelect } from './searchable-select'

const COUNTRIES = [{ value: 'de', label: 'Germany' }]

describe('SearchableSelect snapshots', () => {
  it('matches snapshot — nothing chosen', () => {
    const { container } = renderWithProviders(
      <SearchableSelect
        value=""
        options={COUNTRIES}
        onChange={() => {}}
        aria-label="Country"
        allLabel="Any country"
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — loading', () => {
    const { container } = renderWithProviders(
      <SearchableSelect
        value=""
        options={[]}
        onChange={() => {}}
        onSearch={() => {}}
        isLoading
        aria-label="Country"
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
