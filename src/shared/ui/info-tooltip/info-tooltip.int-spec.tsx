import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TooltipProvider } from '../tooltip'
import { InfoTooltip } from './info-tooltip'

describe('InfoTooltip integration', () => {
  it('puts the explanation in the tab order', async () => {
    render(
      <TooltipProvider delay={0}>
        <InfoTooltip label="Estimated value">
          Indicative — mock prices, converted at a fixed rate.
        </InfoTooltip>
      </TooltipProvider>,
    )

    await userEvent.tab()

    expect(screen.getByRole('button', { name: 'Estimated value' })).toHaveFocus()
    await waitFor(() =>
      expect(
        screen.getByText('Indicative — mock prices, converted at a fixed rate.'),
      ).toBeInTheDocument(),
    )
  })
})
