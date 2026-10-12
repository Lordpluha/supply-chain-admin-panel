import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeFilter } from './range-filter'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
]

describe('RangeFilter', () => {
  /** Nothing narrowed: both ends sit at their extremes. */
  it('falls back to the extremes for an end nobody has set', () => {
    renderWithProviders(
      <RangeFilter
        label="Output"
        options={BANDS}
        value={{ from: '', to: '' }}
        onChange={() => {}}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Output — From' })).toHaveTextContent('0')
    expect(screen.getByRole('combobox', { name: 'Output — To' })).toHaveTextContent('10,000')
  })

  it('shows what the URL carries', () => {
    renderWithProviders(
      <RangeFilter
        label="Output"
        options={BANDS}
        value={{ from: '1000', to: '10000' }}
        onChange={() => {}}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Output — From' })).toHaveTextContent('1,000')
  })

  it('copes with no bands at all', () => {
    renderWithProviders(
      <RangeFilter label="Output" options={[]} value={{ from: '', to: '' }} onChange={() => {}} />,
    )

    expect(screen.getByText('Output')).toBeInTheDocument()
  })
})
