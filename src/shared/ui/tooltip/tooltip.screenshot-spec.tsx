import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

/**
 * An overlay renders into a portal, so the screenshot targets the popup itself
 * rather than a wrapper that never contains it. The baseline lands in
 * `__screenshots__` on the first run — see DEPLOYMENT.md on why that has never
 * happened on the machine this was built on.
 */
describe('Tooltip screenshots', () => {
  it('renders open', async () => {
    await act(async () =>
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger render={<button type="button">Estimated value</button>} />
            <TooltipContent>Indicative — mock prices, converted at a fixed rate.</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      ),
    )

    const popup = document.querySelector<HTMLElement>('[data-slot="tooltip-content"]')

    expect(popup).not.toBeNull()
    await expect(page.elementLocator(popup as HTMLElement)).toMatchScreenshot()
  })
})
