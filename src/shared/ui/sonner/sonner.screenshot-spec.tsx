import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Toaster } from './sonner'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Toaster screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="w-96 p-4">
        <Toaster position="bottom-right" />
        <p>Toasts render into a portal; this pins the region itself.</p>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
