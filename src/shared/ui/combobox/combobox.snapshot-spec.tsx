import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from './combobox'

interface Option {
  value: string
  label: string
}

const COUNTRIES: ReadonlyArray<Option> = [{ value: 'de', label: 'Germany' }]

describe('Combobox snapshots', () => {
  it('matches snapshot — closed', () => {
    const { container } = render(
      <Combobox
        items={COUNTRIES}
        value={null}
        itemToStringLabel={item => (item as Option | null)?.label ?? ''}
      >
        <ComboboxInput aria-label="Country" placeholder="Any country" />
        <ComboboxContent>
          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
