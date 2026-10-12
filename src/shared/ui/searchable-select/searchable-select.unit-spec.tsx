import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { SearchableSelect } from './searchable-select'

const COUNTRIES = [
  { value: 'de', label: 'Germany' },
  { value: 'cl', label: 'Chile' },
]

describe('SearchableSelect', () => {
  /** The trigger is a real text input, which is what lets typing narrow it. */
  it('renders a combobox input', () => {
    renderWithProviders(
      <SearchableSelect value="" options={COUNTRIES} onChange={() => {}} aria-label="Country" />,
    )

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument()
  })

  /**
   * The value is the option **object**, not its id: bound to the id the input
   * renders the raw value and the reader sees `de` where `Germany` belongs.
   */
  it('shows the label of the current value, not its id', () => {
    renderWithProviders(
      <SearchableSelect value="de" options={COUNTRIES} onChange={() => {}} aria-label="Country" />,
    )

    expect(screen.getByRole('combobox')).toHaveValue('Germany')
  })

  it('shows the clear entry by its label, never by its sentinel', () => {
    renderWithProviders(
      <SearchableSelect
        value=""
        options={COUNTRIES}
        onChange={() => {}}
        aria-label="Country"
        allLabel="Any country"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveValue('Any country')
    expect(screen.getByRole('combobox')).not.toHaveValue('__all__')
  })

  it('sizes itself against the longest label it could show', () => {
    const { container } = renderWithProviders(
      <SearchableSelect
        value=""
        options={[
          { value: 'cl', label: 'Chile' },
          { value: 'gb', label: 'United Kingdom' },
        ]}
        onChange={() => {}}
        aria-label="Country"
      />,
    )

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('United Kingdom')
  })

  it('takes the placeholder it is given', () => {
    renderWithProviders(
      <SearchableSelect
        value=""
        options={COUNTRIES}
        onChange={() => {}}
        aria-label="Country"
        placeholder="Any country"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Any country')
  })
})
