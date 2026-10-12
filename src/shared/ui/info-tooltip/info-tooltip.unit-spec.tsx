import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TooltipProvider } from '../tooltip'
import { InfoTooltip, LabelWithInfo } from './info-tooltip'

describe('InfoTooltip', () => {
  /**
   * A real `<button type="button">`, not an icon with `title`: `title` shows on
   * hover only, so a keyboard or touch reader never sees it.
   */
  it('is a button, not a decorated icon', () => {
    render(
      <TooltipProvider>
        <InfoTooltip label="Estimated value">Indicative only.</InfoTooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole('button', { name: 'Estimated value' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('takes its accessible name from the label, since the icon carries no text', () => {
    render(
      <TooltipProvider>
        <InfoTooltip label="Change over range">Measured between reported years.</InfoTooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole('button', { name: 'Change over range' })).toBeInTheDocument()
  })
})

describe('LabelWithInfo', () => {
  it('renders the label beside its explanation button', () => {
    render(
      <TooltipProvider>
        <LabelWithInfo label="Start by choosing" info="Which list narrows." />
      </TooltipProvider>,
    )

    expect(screen.getByText('Start by choosing')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start by choosing' })).toBeInTheDocument()
  })

  it('lets the button be named separately from the label it sits beside', () => {
    render(
      <TooltipProvider>
        <LabelWithInfo label="Years" info="Both ends move." infoLabel="About the year range" />
      </TooltipProvider>,
    )

    expect(screen.getByRole('button', { name: 'About the year range' })).toBeInTheDocument()
  })
})
