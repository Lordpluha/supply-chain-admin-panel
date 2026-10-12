import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OptionSelect } from './option-select'

const REGIONS = [
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
]

describe('OptionSelect integration', () => {
  it('reports the chosen value', async () => {
    const onChange = vi.fn()
    render(
      <OptionSelect
        value=""
        options={REGIONS}
        onChange={onChange}
        aria-label="Region"
        allLabel="All"
      />,
    )

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Asia' }))

    expect(onChange).toHaveBeenCalledWith('Asia')
  })

  /** Choosing "all" clears the filter, and clearing means an empty string — the
   *  sentinel never escapes the component. */
  it('reports an empty string when the clear entry is chosen', async () => {
    const onChange = vi.fn()
    render(
      <OptionSelect
        value="Asia"
        options={REGIONS}
        onChange={onChange}
        aria-label="Region"
        allLabel="All"
      />,
    )

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'All' }))

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('heads a group of options that share one', async () => {
    render(
      <OptionSelect
        value=""
        options={[
          { value: 'yichun', label: 'Yichun Refinery', group: 'Refinery' },
          { value: 'erfurt', label: 'Erfurt Cell Plant', group: 'Gigafactory' },
        ]}
        onChange={() => {}}
        aria-label="Facility"
      />,
    )

    await userEvent.click(screen.getByRole('combobox'))

    await waitFor(() => expect(screen.getByText('Refinery')).toBeInTheDocument())
    expect(screen.getByText('Gigafactory')).toBeInTheDocument()
  })
})
