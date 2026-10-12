import { act } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { Field } from '../field'
import { FormActions } from '../form-actions'
import { Input } from '../input'
import { Form } from './form'

interface Values {
  name: string
  iso2: string
}

const Harness = () => {
  const form = useForm<Values>({ defaultValues: { name: 'Germany', iso2: 'D' } })

  return (
    <div data-testid="subject" className="w-96 p-4">
      <Form control={form.control} onSubmit={form.handleSubmit(() => {})}>
        <Field label="Name" required>
          {props => <Input {...props} {...form.register('name')} />}
        </Field>
        <Field label="ISO-2" error="Exactly 2 letters" required>
          {props => <Input {...props} {...form.register('iso2')} />}
        </Field>
        <FormActions isPending={false} onCancel={() => {}} />
      </Form>
    </div>
  )
}

/**
 * A whole form, with one field failing: label, control, and the message beside
 * the control — never in a toast.
 */
describe('Form screenshots', () => {
  it('renders a form with a failing field', async () => {
    await act(async () => renderWithProviders(<Harness />))
    await act(async () => {
      await vi.dynamicImportSettled()
    })

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
