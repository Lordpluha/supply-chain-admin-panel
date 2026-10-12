import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { Form } from './form'

const Harness = () => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return (
    <Form control={form.control} onSubmit={form.handleSubmit(() => {})}>
      <input aria-label="Name" {...form.register('name')} />
    </Form>
  )
}

describe('Form snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<Harness />)

    expect(container.querySelector('form')).toMatchSnapshot()
  })
})
