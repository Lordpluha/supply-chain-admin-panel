import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeSelect } from './range-select'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
  { value: '100000', label: '100,000' },
]

describe('RangeSelect snapshots', () => {
  it('matches snapshot', () => {
    const { container } = renderWithProviders(
      <RangeSelect
        label="Output"
        options={BANDS}
        value={{ from: '1000', to: '10000' }}
        onChange={() => {}}
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
