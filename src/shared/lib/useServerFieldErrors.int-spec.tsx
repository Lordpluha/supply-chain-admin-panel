import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/shared/api'
import { Field } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { useServerFieldErrors } from './useServerFieldErrors'

interface Values {
  name: string
  iso2: string
}

/**
 * The failure is applied from a button rather than from the test body, because
 * that is how the real call site works: a mutation's `onError` hands the error
 * over, and the return value decides whether a toast follows.
 */
const Harness = ({ error }: { error: unknown }) => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const form = useForm<Values>({ defaultValues: { name: '', iso2: '' } })
  const [handled, setHandled] = useState<boolean | null>(null)

  const applyServerErrors = useServerFieldErrors({ form, formRef })

  return (
    <form ref={formRef}>
      <Field label="Name" error={form.formState.errors.name?.message}>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>
      <Field label="ISO-2" error={form.formState.errors.iso2?.message}>
        {props => <Input {...props} {...form.register('iso2')} />}
      </Field>

      <button type="button" onClick={() => setHandled(applyServerErrors(error))}>
        Submit
      </button>

      {handled === null ? null : <output>handled: {String(handled)}</output>}
    </form>
  )
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Submit' }))

describe('useServerFieldErrors', () => {
  it('replays the server’s messages onto their fields', async () => {
    render(
      <Harness
        error={
          new ApiError(400, 'Validation failed', {
            message: 'Validation failed',
            fields: { name: 'At least 2 characters', iso2: 'Exactly 2 letters' },
          })
        }
      />,
    )

    await submit()

    await waitFor(() => expect(screen.getByText('At least 2 characters')).toBeInTheDocument())
    expect(screen.getByText('Exactly 2 letters')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('handled: true')).toBeInTheDocument()
  })

  /**
   * The return value is the signal not to fall through to a toast: a failure
   * that names a field is already answered beside that field.
   */
  it('reports that it did not handle a refusal with no field', async () => {
    render(<Harness error={new ApiError(409, 'Conflict')} />)

    await submit()

    expect(screen.getByText('handled: false')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'false')
  })

  it('reports that it did not handle a thrown Error', async () => {
    render(<Harness error={new Error('boom')} />)

    await submit()

    expect(screen.getByText('handled: false')).toBeInTheDocument()
  })

  /** Scroll first, then focus: focusing alone jumps and loses the reader's place. */
  it('scrolls the first invalid control into view and focuses it', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    render(
      <Harness
        error={
          new ApiError(400, 'Validation failed', {
            message: 'Validation failed',
            fields: { iso2: 'Exactly 2 letters' },
          })
        }
      />,
    )

    await submit()

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'ISO-2' })).toHaveFocus())
  })
})
