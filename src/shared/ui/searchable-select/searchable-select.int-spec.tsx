import { fireEvent, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { SearchableSelect } from './searchable-select'

const OPTIONS = [
  { value: 'de', label: 'Germany' },
  { value: 'cl', label: 'Chile' },
]

const openList = () => {
  // The chevron is the only button inside the control.
  fireEvent.click(screen.getByRole('button'))
}

describe('SearchableSelect', () => {
  it('reports what was typed, so the API owns the search', async () => {
    const onSearch = vi.fn()
    renderWithProviders(
      <SearchableSelect
        value=""
        options={OPTIONS}
        onChange={() => {}}
        onSearch={onSearch}
        allLabel="Any country"
      />,
    )

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Germ' } })

    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('Germ'))
    expect(screen.getByRole('combobox')).toHaveValue('Germ')
  })

  /**
   * The regression this exists for.
   *
   * `onInputValueChange` fires both when the operator types and when the
   * combobox writes the *selected* item's label into the field. Forwarding the
   * second made the label the next query: picking "Germany" searched for
   * "Germany", and clearing searched for the literal "Any country" — which
   * matches nothing, so the list collapsed to the clear entry and no other
   * option could ever be chosen again.
   */
  it('never sends a selection label as a search term', async () => {
    const onSearch = vi.fn()
    const onChange = vi.fn()

    renderWithProviders(
      <SearchableSelect
        value=""
        options={OPTIONS}
        onChange={onChange}
        onSearch={onSearch}
        allLabel="Any country"
      />,
    )

    openList()
    fireEvent.click(await screen.findByRole('option', { name: 'Germany' }))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('de'))

    const terms = onSearch.mock.calls.map(([term]) => term)
    expect(terms).not.toContain('Germany')
    expect(terms).not.toContain('Any country')
  })

  /** Clearing widens the list again rather than leaving the last term in force. */
  it('resets the search when the selection changes', async () => {
    const onSearch = vi.fn()
    const onChange = vi.fn()

    renderWithProviders(
      <SearchableSelect
        value="de"
        options={OPTIONS}
        onChange={onChange}
        onSearch={onSearch}
        allLabel="Any country"
      />,
    )

    openList()
    fireEvent.click(await screen.findByRole('option', { name: 'Any country' }))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(''))
    expect(onSearch).toHaveBeenCalledWith('')
  })

  it('offers every option it was given, plus the entry that clears', async () => {
    renderWithProviders(
      <SearchableSelect
        value=""
        options={OPTIONS}
        onChange={() => {}}
        onSearch={() => {}}
        allLabel="Any country"
      />,
    )

    openList()

    expect(await screen.findByRole('option', { name: 'Any country' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Chile' })).toBeInTheDocument()
  })

  /**
   * The production form's product field: local filtering, a placeholder and no
   * "any" entry. The placeholder used to be written into the field as its
   * value, so the list was filtered by the word "Product" and offered nothing.
   */
  it('offers every option when nothing is chosen and it filters locally', async () => {
    renderWithProviders(
      <SearchableSelect value="" options={OPTIONS} onChange={() => {}} placeholder="Product" />,
    )

    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Product')

    openList()

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2))
  })

  it('offers every option again when reopened after a choice', async () => {
    const Harness = () => {
      const [value, setValue] = useState('')
      return (
        <SearchableSelect
          value={value}
          options={OPTIONS}
          onChange={setValue}
          placeholder="Product"
        />
      )
    }
    renderWithProviders(<Harness />)

    openList()
    fireEvent.click(await screen.findByRole('option', { name: 'Chile' }))
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Chile'))
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())

    openList()

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2))
  })
})
