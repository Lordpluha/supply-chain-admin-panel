import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { DatePicker } from './date-input'

const Harness = () => {
  const [value, setValue] = useState('')
  return <DatePicker value={value} min="2026-09-10" max="2026-09-20" onValueChange={setValue} />
}

describe('DatePicker', () => {
  it('selects and clears a date while enforcing its limits', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />)

    await user.click(screen.getByRole('button', { name: 'Select date' }))
    let calendar = await screen.findByRole('dialog', { name: 'Select date' })

    expect(within(calendar).getByRole('button', { name: /September 9th, 2026/ })).toBeDisabled()
    await user.click(within(calendar).getByRole('button', { name: /September 15th, 2026/ }))

    expect(screen.getByRole('button', { name: /Sep 15, 2026/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Sep 15, 2026/ }))
    calendar = await screen.findByRole('dialog', { name: 'Select date' })
    await user.click(within(calendar).getByRole('button', { name: 'Clear date' }))

    expect(screen.getByRole('button', { name: 'Select date' })).toBeInTheDocument()
  })
})
