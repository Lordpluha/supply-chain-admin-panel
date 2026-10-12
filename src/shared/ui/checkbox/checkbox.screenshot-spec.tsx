import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Checkbox } from './checkbox'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Checkbox screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex items-center gap-4 p-4">
        <Checkbox aria-label="Unchecked" />
        <Checkbox defaultChecked aria-label="Checked" />
        <Checkbox disabled aria-label="Disabled" />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
