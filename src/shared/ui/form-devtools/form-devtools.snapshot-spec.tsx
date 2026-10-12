import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { FormDevtools } from './form-devtools'

const Harness = () => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return <FormDevtools control={form.control} />
}

describe('FormDevtools snapshots', () => {
  /** Nothing on the first paint: the panel is behind `Suspense` with a null
   *  fallback, and is absent from a production build entirely. */
  it('matches snapshot — nothing rendered synchronously', () => {
    const { container } = render(<Harness />)

    expect(container.innerHTML).toMatchSnapshot()
  })
})
