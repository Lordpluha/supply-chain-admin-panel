import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from './combobox'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Combobox screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="w-64 p-4">
        <Combobox
          items={[{ value: 'de', label: 'Germany' }]}
          value={null}
          itemToStringLabel={item => (item as { label: string } | null)?.label ?? ''}
        >
          <ComboboxInput aria-label="Country" placeholder="Any country" />
          <ComboboxContent>
            <ComboboxList>
              {(item: { value: string; label: string }) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
