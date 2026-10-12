import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TooltipProvider } from '../tooltip'
import { LabelWithInfo } from './info-tooltip'

describe('InfoTooltip snapshots', () => {
  it('matches snapshot — label with its info button', () => {
    const { container } = render(
      <TooltipProvider>
        <LabelWithInfo label="Start by choosing" info="Which list narrows." />
      </TooltipProvider>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
