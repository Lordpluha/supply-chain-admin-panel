import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('Tooltip snapshots', () => {
  it('matches snapshot — open', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger render={<button type="button">Estimated value</button>} />
          <TooltipContent>Indicative only.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(document.querySelector('[data-slot="tooltip-content"]')).toMatchSnapshot()
  })
})
