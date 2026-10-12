import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeFilter } from './range-filter'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
]

const render = (onChange: (from: string | null, to: string | null) => void) =>
  renderWithProviders(
    <RangeFilter label="Output" options={BANDS} value={{ from: '', to: '' }} onChange={onChange} />,
  )

describe('RangeFilter integration', () => {
  it('reports a narrowed end as a value', async () => {
    const onChange = vi.fn()
    render(onChange)

    await userEvent.click(screen.getByRole('combobox', { name: 'Output — From' }))
    await userEvent.click(await screen.findByRole('option', { name: '1,000' }))

    expect(onChange).toHaveBeenCalledWith('1000', null)
  })

  /**
   * An end back at its extreme is not a filter. Reported as  the key
   * leaves the URL entirely — otherwise every list would arrive carrying
   *  and offer to clear a filter nobody set.
   */
  it('reports an end back at its extreme as nothing at all', async () => {
    const onChange = vi.fn()
    renderWithProviders(
      <RangeFilter
        label="Output"
        options={BANDS}
        value={{ from: '1000', to: '' }}
        onChange={onChange}
      />,
    )

    await userEvent.click(screen.getByRole('combobox', { name: 'Output — From' }))
    await userEvent.click(await screen.findByRole('option', { name: '0' }))

    expect(onChange).toHaveBeenCalledWith(null, null)
  })
})
