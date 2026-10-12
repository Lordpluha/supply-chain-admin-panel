import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Button } from '../button'
import { AutoWidth } from './auto-width'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('AutoWidth screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <AutoWidth labels={['Mine', 'Brine extraction', 'Gigafactory']} trailing="pe-3">
          <Button variant="outline">Mine</Button>
        </AutoWidth>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
