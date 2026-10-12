import { act, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { FormDevtools } from './form-devtools'

const Harness = () => {
  const form = useForm<{ name: string }>({ defaultValues: { name: '' } })

  return (
    <div data-testid="subject" className="w-96 p-4">
      <input aria-label="Name" {...form.register('name')} />
      <FormDevtools control={form.control} />
    </div>
  )
}

/**
 * The panel is a development-only overlay that never reaches a production
 * build, so what is pinned here is that it does not disturb the form it sits in.
 */
describe('FormDevtools screenshots', () => {
  it('leaves the form it sits in alone', async () => {
    await act(async () => render(<Harness />))
    // Wait for the actual lazy import chain, including Vite's browser wrapper.
    await act(async () => {
      await vi.dynamicImportSettled()
    })
    expect(screen.getByTitle('Show dev panel').tagName).toBe('BUTTON')

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
