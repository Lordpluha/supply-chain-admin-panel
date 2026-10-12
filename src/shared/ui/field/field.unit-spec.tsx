import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { Field } from './field'

describe('Field', () => {
  it('names its control', () => {
    render(<Field label="Name">{props => <Input {...props} />}</Field>)

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  it('renders a hint when given one', () => {
    render(
      <Field label="Capacity" hint="Nameplate capacity, per year.">
        {props => <Input {...props} />}
      </Field>,
    )

    expect(screen.getByText('Nameplate capacity, per year.')).toBeInTheDocument()
  })

  it('marks the control invalid and puts the reason beside it', () => {
    render(
      <Field label="Name" error="At least 2 characters">
        {props => <Input {...props} />}
      </Field>,
    )

    const control = screen.getByRole('textbox')

    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('At least 2 characters')
  })

  it('is not invalid without an error', () => {
    render(<Field label="Name">{props => <Input {...props} />}</Field>)

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false')
  })

  it('marks a required control as required', () => {
    render(
      <Field label="ISO-2" required>
        {props => <Input {...props} />}
      </Field>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true')
  })

  /**
   * The error replaces the hint rather than stacking under it: two sentences
   * about one field, one of which is now wrong, is worse than one.
   */
  it('describes with the error rather than the hint once it fails', () => {
    render(
      <Field label="Name" hint="The country's common name" error="At least 2 characters">
        {props => <Input {...props} />}
      </Field>,
    )

    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('At least 2 characters')
  })
})
