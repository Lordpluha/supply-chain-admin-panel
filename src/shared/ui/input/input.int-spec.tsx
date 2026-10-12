import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './input'

describe('Input integration', () => {
  it('records what is typed into it', async () => {
    const onChange = vi.fn()
    render(<Input aria-label="Name" onChange={onChange} />)

    await userEvent.type(screen.getByRole('textbox'), 'Germany')

    expect(screen.getByRole('textbox')).toHaveValue('Germany')
    expect(onChange).toHaveBeenCalled()
  })

  it('accepts nothing while disabled', async () => {
    render(<Input aria-label="Name" disabled />)

    await userEvent.type(screen.getByRole('textbox'), 'Germany')

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('is reachable by tabbing', async () => {
    render(
      <>
        <Input aria-label="First" />
        <Input aria-label="Second" />
      </>,
    )

    await userEvent.tab()
    expect(screen.getByLabelText('First')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByLabelText('Second')).toHaveFocus()
  })
})
