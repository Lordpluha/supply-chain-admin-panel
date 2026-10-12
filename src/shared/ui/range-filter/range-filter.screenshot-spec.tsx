import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeFilter } from './range-filter'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
]

/** Pixels, in a real browser. The baseline lands on the first run. */
describe('RangeFilter screenshots', () => {
  it('renders in a toolbar', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex items-end gap-3 p-4">
        <RangeFilter
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
