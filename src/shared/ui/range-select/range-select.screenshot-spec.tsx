import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeSelect } from './range-select'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
  { value: '100000', label: '100,000' },
]

/** Pixels, in a real browser. The baseline lands on the first run. */
describe('RangeSelect screenshots', () => {
  it('renders the joined pair', async () => {
    renderWithProviders(
      <div data-testid="subject" className="w-72 p-4">
        <RangeSelect
          label="Output"
          options={BANDS}
          value={{ from: '1000', to: '10000' }}
          onChange={() => {}}
        />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
