import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import type { RangeSelectValue } from './range-select'
import { RangeSelect } from './range-select'

const BANDS = [
  { value: '0', label: '0' },
  { value: '1000', label: '1,000' },
  { value: '10000', label: '10,000' },
  { value: '100000', label: '100,000' },
]

const Harness = ({ onChange }: { onChange?: (value: RangeSelectValue) => void }) => {
  const [value, setValue] = useState<RangeSelectValue>({ from: '0', to: '100000' })

  return (
    <RangeSelect
      label="Output"
      options={BANDS}
      value={value}
      onChange={next => {
        setValue(next)
        onChange?.(next)
      }}
    />
  )
}

const open = (end: 'From' | 'To') =>
  userEvent.click(screen.getByRole('combobox', { name: `Output — ${end}` }))

describe('RangeSelect integration', () => {
  it('reports the end that moved, and keeps the other', async () => {
    const onChange = vi.fn()
    renderWithProviders(<Harness onChange={onChange} />)

    await open('From')
    await userEvent.click(await screen.findByRole('option', { name: '1,000' }))

    expect(onChange).toHaveBeenCalledWith({ from: '1000', to: '100000' })
  })

  /**
   * The ends cannot be inverted, because neither is offered a value past the
   * other — the guarantee a two-thumb slider gave by clamping.
   */
  it('does not offer the lower end a value above the upper one', async () => {
    renderWithProviders(<Harness />)

    await open('To')
    await userEvent.click(await screen.findByRole('option', { name: '1,000' }))

    await open('From')

    await waitFor(() =>
      expect(screen.getByRole('option', { name: '100,000' })).toHaveAttribute('data-disabled'),
    )
    expect(screen.getByRole('option', { name: '0' })).not.toHaveAttribute('data-disabled')
  })

  it('does not offer the upper end a value below the lower one', async () => {
    renderWithProviders(<Harness />)

    await open('From')
    await userEvent.click(await screen.findByRole('option', { name: '10,000' }))

    await open('To')

    await waitFor(() =>
      expect(screen.getByRole('option', { name: '0' })).toHaveAttribute('data-disabled'),
    )
  })

  it('gives each end its own tab stop', async () => {
    renderWithProviders(<Harness />)

    await userEvent.tab()
    expect(screen.getByRole('combobox', { name: 'Output — From' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('combobox', { name: 'Output — To' })).toHaveFocus()
  })
})
