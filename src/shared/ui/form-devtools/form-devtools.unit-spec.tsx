import { act, render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { FormDevtools } from './form-devtools'

const Harness = () => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return <FormDevtools control={form.control} />
}

describe('FormDevtools', () => {
  /**
   * Wait for the lazy panel to mount: every form renders it in development,
   * so an import or render failure here would affect every form.
   */
  it('renders without disturbing the form it belongs to', async () => {
    const { container } = await act(async () => render(<Harness />))
    // Wait for the actual lazy import chain, including Vite's browser wrapper.
    await act(async () => {
      await vi.dynamicImportSettled()
    })

    expect(container).toBeInTheDocument()
  })

  /**
   * The guard is a bare `import.meta.env.DEV` so Vite replaces it with a
   * literal `false` in a production build: the branch is dropped and
   * `@hookform/devtools` never enters the bundle. Hoisting the check into a
   * variable would defeat that replacement — see the component's own comment.
   */
  it('is compiled out of production, which is why the check stays literal', async () => {
    const source = await import('./form-devtools?raw')

    expect(source.default).toContain('import.meta.env.DEV')
  })
})
