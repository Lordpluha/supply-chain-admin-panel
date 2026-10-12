import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { OptionSelect } from './option-select'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('OptionSelect screenshots', () => {
  it('renders its variants', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <OptionSelect
          value=""
          options={[
            { value: 'Europe', label: 'Europe' },
            { value: 'South America', label: 'South America' },
          ]}
          onChange={() => {}}
          aria-label="Region"
          allLabel="All"
        />
        <OptionSelect
          value="Europe"
          options={[{ value: 'Europe', label: 'Europe' }]}
          onChange={() => {}}
          aria-label="Region"
        />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
