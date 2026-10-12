import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { Field } from './field'

describe('Field integration', () => {
  it('focuses its control when the label is clicked', async () => {
    render(<Field label="Name">{props => <Input {...props} />}</Field>)

    await userEvent.click(screen.getByText('Name'))

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
  })

  it('accepts typing and keeps its name while it does', async () => {
    render(<Field label="Name">{props => <Input {...props} />}</Field>)

    await userEvent.type(screen.getByRole('textbox'), 'Germany')

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Germany')
  })

  /** Colour is never the only signal — `a11y.md`. The reason is written out. */
  it('states the reason in text, not only in colour', async () => {
    const { rerender } = render(<Field label="Name">{props => <Input {...props} />}</Field>)

    await userEvent.type(screen.getByRole('textbox'), 'S')

    rerender(
      <Field label="Name" error="At least 2 characters">
        {props => <Input {...props} />}
      </Field>,
    )

    expect(screen.getByText('At least 2 characters')).toBeInTheDocument()
  })
})
