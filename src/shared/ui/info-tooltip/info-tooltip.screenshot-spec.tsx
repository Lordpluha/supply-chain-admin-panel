import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { TooltipProvider } from '../tooltip'
import { LabelWithInfo } from './info-tooltip'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('InfoTooltip screenshots', () => {
  it('renders its variants', async () => {
    renderWithProviders(
      <div data-testid="subject" className="w-80 p-4">
        <TooltipProvider>
          <LabelWithInfo label="Estimated value" info="Indicative only." className="typo-label" />
        </TooltipProvider>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
