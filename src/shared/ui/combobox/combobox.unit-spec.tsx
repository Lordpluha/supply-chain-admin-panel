import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from './combobox'

interface Option {
  value: string
  label: string
}

const COUNTRIES: ReadonlyArray<Option> = [
  { value: 'de', label: 'Germany' },
  { value: 'cl', label: 'Chile' },
]

const renderCombobox = (value: Option | null = null) =>
  render(
    <Combobox
      items={COUNTRIES}
      value={value}
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

describe('Combobox', () => {
  it('renders an input with the combobox role', () => {
    renderCombobox()

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument()
  })

  it('keeps the list closed until asked', () => {
    renderCombobox()

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  /**
   * The value is the option object, not its id: bound to the id the input
   * renders the raw value and shows `de` where `Germany` belongs.
   */
  it('renders the label of the value it holds', () => {
    renderCombobox(COUNTRIES[0])

    expect(screen.getByRole('combobox')).toHaveValue('Germany')
  })

  it('offers a trigger beside the input', () => {
    renderCombobox()

    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'listbox')
  })
})
