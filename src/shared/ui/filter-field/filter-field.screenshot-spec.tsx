import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Input } from '../input'
import { FilterField } from './filter-field'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('FilterField screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex items-end gap-3 p-4">
        <FilterField label="Search" htmlFor="search" className="w-52">
          <Input id="search" type="search" placeholder="Search" />
        </FilterField>
        <FilterField label="Region">
          <button
            type="button"
            aria-label="Region"
            className="border-border rounded-md border px-3 py-2"
          >
            All
          </button>
        </FilterField>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
