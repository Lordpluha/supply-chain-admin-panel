import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { RangeSelect } from './range-select'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
  { value: '100000', label: '100,000' },
]

const render = (from = '0', to = '100000') =>
  renderWithProviders(
    <RangeSelect label="Output" options={BANDS} value={{ from, to }} onChange={() => {}} />,
  )

describe('RangeSelect', () => {
  it('names itself once and each end separately', () => {
    render()

    expect(screen.getByText('Output')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Output — From' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Output — To' })).toBeInTheDocument()
  })

  it('shows each end by its label, not its raw value', () => {
    render('1000', '10000')

    expect(screen.getByRole('combobox', { name: 'Output — From' })).toHaveTextContent('1,000')
    expect(screen.getByRole('combobox', { name: 'Output — To' })).toHaveTextContent('10,000')
  })

  /** One value with two ends, so the two triggers are drawn as one control. */
  it('squares the inner corners so the pair reads as one control', () => {
    render()

    expect(screen.getByRole('combobox', { name: 'Output — From' })).toHaveClass('rounded-e-none')
    expect(screen.getByRole('combobox', { name: 'Output — To' })).toHaveClass('rounded-s-none')
  })

  it('puts its explanation behind an info button when given one', () => {
    renderWithProviders(
      <RangeSelect
        label="Output"
        options={BANDS}
        value={{ from: '0', to: '100000' }}
        onChange={() => {}}
        slots={{ info: 'Both ends move.' }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Output' })).toBeInTheDocument()
  })
})
