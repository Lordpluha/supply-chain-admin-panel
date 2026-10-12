import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('Tooltip', () => {
  it('renders its trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<button type="button">Estimated value</button>} />
          <TooltipContent>Indicative only.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole('button', { name: 'Estimated value' })).toBeInTheDocument()
  })

  /** Closed is the default; a tooltip that renders eagerly is just text. */
  it('keeps its content out of the page until asked for', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<button type="button">Estimated value</button>} />
          <TooltipContent>Indicative only.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.queryByText('Indicative only.')).not.toBeInTheDocument()
  })

  it('shows its content when opened', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger render={<button type="button">Estimated value</button>} />
          <TooltipContent>Indicative only.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByText('Indicative only.')).toBeInTheDocument()
  })
})
