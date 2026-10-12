import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Textarea } from './textarea'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Textarea screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-3 p-4">
        <Textarea placeholder="Describe the role" rows={3} />
        <Textarea aria-invalid defaultValue="Too short" rows={3} />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
