import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { Form } from './form'

const Harness = ({ children }: { children?: React.ReactNode }) => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return (
    <Form control={form.control} onSubmit={form.handleSubmit(() => {})}>
      {children ?? <input aria-label="Name" {...form.register('name')} />}
    </Form>
  )
}

describe('Form', () => {
  it('renders a form element around its children', () => {
    const { container } = render(<Harness />)

    expect(container.querySelector('form')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  /**
   * `noValidate` is deliberate: the browser's own validation bubbles are
   * unstyled, untranslated, and would pre-empt the messages `Field` renders
   * beside the input.
   */
  it('turns off the browser’s own validation bubbles', () => {
    const { container } = render(<Harness />)

    expect(container.querySelector('form')).toHaveAttribute('noValidate')
  })
})
