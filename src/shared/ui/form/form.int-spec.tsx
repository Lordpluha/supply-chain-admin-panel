import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { Field } from '../field'
import { FormActions } from '../form-actions'
import { Input } from '../input'
import { Form } from './form'

interface Values {
  name: string
}

const Harness = ({ onValid }: { onValid: (values: Values) => void }) => {
  const form = useForm<Values>({ defaultValues: { name: '' } })

  return (
    <Form control={form.control} onSubmit={form.handleSubmit(onValid)}>
      <Field label="Name" error={form.formState.errors.name?.message} required>
        {props => (
          <Input {...props} {...form.register('name', { required: 'At least 2 characters' })} />
        )}
      </Field>
      <FormActions isPending={false} onCancel={() => form.reset()} />
    </Form>
  )
}

describe('Form integration', () => {
  it('submits the values that were typed', async () => {
    const onValid = vi.fn()
    renderWithProviders(<Harness onValid={onValid} />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Germany')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(onValid).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Germany' }),
        expect.anything(),
      ),
    )
  })

  /** The message lands beside the field, never in a toast — `errors.md`. */
  it('refuses an invalid submit and marks the field', async () => {
    const onValid = vi.fn()
    renderWithProviders(<Harness onValid={onValid} />)

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.getByText('At least 2 characters')).toBeInTheDocument())
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
    expect(onValid).not.toHaveBeenCalled()
  })

  it('clears what was typed when cancelled', async () => {
    renderWithProviders(<Harness onValid={() => {}} />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Germany')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(''))
  })
})
