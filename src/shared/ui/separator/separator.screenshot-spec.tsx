import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Separator } from './separator'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Separator screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-64 flex-col gap-3 p-4">
        <span>Above</span>
        <Separator />
        <span>Below</span>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
