import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { FormDevtools } from './form-devtools'

const Harness = () => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <input aria-label="Name" {...form.register('name')} />
      <FormDevtools control={form.control} />
    </form>
  )
}

describe('FormDevtools integration', () => {
  /** It sits inside every form, so it must not get in the way of one. */
  it('leaves the form it sits in fully usable', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Germany')

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Germany')
  })
})
