import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeFilter } from './range-filter'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
]

describe('RangeFilter snapshots', () => {
  it('matches snapshot — nothing narrowed', () => {
    const { container } = renderWithProviders(
      <RangeFilter
        label="Output"
        options={BANDS}
        value={{ from: '', to: '' }}
        onChange={() => {}}
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
