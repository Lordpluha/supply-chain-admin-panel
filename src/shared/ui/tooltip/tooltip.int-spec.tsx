import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const renderTooltip = () =>
  render(
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger render={<button type="button">Estimated value</button>} />
        <TooltipContent>Indicative only.</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )

describe('Tooltip integration', () => {
  it('opens on hover', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button'))

    await waitFor(() => expect(screen.getByText('Indicative only.')).toBeInTheDocument())
  })

  /**
   * The reason this is a real button rather than an icon with `title`: a
   * keyboard or touch reader never hovers, so focus has to open it too.
   */
  it('opens on focus, which is what makes it reachable without a pointer', async () => {
    renderTooltip()

    await userEvent.tab()

    expect(screen.getByRole('button')).toHaveFocus()
    await waitFor(() => expect(screen.getByText('Indicative only.')).toBeInTheDocument())
  })

  it('closes again on Escape', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText('Indicative only.')).toBeInTheDocument())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByText('Indicative only.')).not.toBeInTheDocument())
  })
})
