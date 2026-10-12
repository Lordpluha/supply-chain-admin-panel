import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { SearchableSelect } from './searchable-select'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('SearchableSelect screenshots', () => {
  it('renders its variants', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <SearchableSelect
          value=""
          options={[
            { value: 'de', label: 'Germany' },
            { value: 'gb', label: 'United Kingdom' },
          ]}
          onChange={() => {}}
          aria-label="Country"
          allLabel="Any country"
        />
        <SearchableSelect
          value="de"
          options={[{ value: 'de', label: 'Germany' }]}
          onChange={() => {}}
          aria-label="Country"
        />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
